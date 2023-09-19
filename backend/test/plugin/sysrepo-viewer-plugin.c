#include <signal.h>
#include <sysrepo.h>
#include <unistd.h>

volatile int exit_application = 0;

static void sigint_handler(__attribute__((unused)) int signum);
static int sr_plugin_init_cb(sr_session_ctx_t *session, void **priv);
static int sr_plugin_cleanup_cb(sr_session_ctx_t *session, void *priv);
int valid_module_change_cb(sr_session_ctx_t *session, uint32_t sub_id, const char *module_name, const char *xpath,
                           sr_event_t event, uint32_t request_id, void *private_data);

#define PLUGIN_NAME "sysrepo-viewer-example-plugin"

int main(void)
{
    int error = SR_ERR_OK;
    sr_conn_ctx_t *connection = NULL;
    sr_session_ctx_t *session = NULL;
    void *private_data = NULL;

    sr_log_stderr(SR_LL_DBG);

    /* connect to sysrepo */
    error = sr_connect(SR_CONN_DEFAULT, &connection);
    if (error)
    {
        SRPLG_LOG_ERR(PLUGIN_NAME, "sr_connect error (%d): %s", error, sr_strerror(error));
        goto out;
    }

    error = sr_session_start(connection, SR_DS_RUNNING, &session);
    if (error)
    {
        SRPLG_LOG_ERR(PLUGIN_NAME, "sr_session_start error (%d): %s", error, sr_strerror(error));
        goto out;
    }

    error = sr_plugin_init_cb(session, &private_data);
    if (error)
    {
        SRPLG_LOG_ERR(PLUGIN_NAME, "sr_plugin_init_cb error");
        goto out;
    }

    /* loop until ctrl-c is pressed / SIGINT is received */
    signal(SIGINT, sigint_handler);
    signal(SIGPIPE, SIG_IGN);
    while (!exit_application)
    {
        sleep(1);
    }

out:
    sr_plugin_cleanup_cb(session, private_data);
    sr_disconnect(connection);

    return error ? -1 : 0;
}

static void sigint_handler(__attribute__((unused)) int signum)
{
    SRPLG_LOG_INF(PLUGIN_NAME, "Sigint called, exiting...");
    exit_application = 1;
}

static int sr_plugin_init_cb(sr_session_ctx_t *session, void **priv)
{
    int error = SR_ERR_OK;
    sr_session_ctx_t *startup_session = NULL;
    sr_conn_ctx_t *connection = NULL;
    sr_subscription_ctx_t *subscription = NULL;

    *priv = NULL;

    connection = sr_session_get_connection(session);
    error = sr_session_start(connection, SR_DS_STARTUP, &startup_session);
    if (error)
    {
        SRPLG_LOG_ERR(PLUGIN_NAME, "sr_session_start error: %d -> %s", error, sr_strerror(error));
    }

    *priv = startup_session;

    SRPLG_LOG_INF(PLUGIN_NAME, "subscribing to module change");

    error =
        sr_module_change_subscribe(session, "sysrepo-viewer-example", "/sysrepo-viewer-example:test-container/valid",
                                   valid_module_change_cb, *priv, 0, SR_SUBSCR_DEFAULT, &subscription);
    if (error)
    {
        SRPLG_LOG_ERR(PLUGIN_NAME, "sr_module_change_subscribe error (%d): %s", error, sr_strerror(error));
        goto error_out;
    }

    goto out;

error_out:
    SRPLG_LOG_ERR(PLUGIN_NAME, "error occured while initializing the plugin -> %d", error);

out:
    return error;
}

static int sr_plugin_cleanup_cb(sr_session_ctx_t *session, void *priv)
{
    int error = 0;
    return error;
}

int valid_module_change_cb(sr_session_ctx_t *session, uint32_t sub_id, const char *module_name, const char *xpath,
                           sr_event_t event, uint32_t request_id, void *private_data)
{
    int error = SR_ERR_OK;
    SRPLG_LOG_DBG(PLUGIN_NAME, "path changed: %s", xpath);
    return error;
}
