cmake_minimum_required(VERSION 3.0.0)
project(sysrepo-viewer-plugin VERSION 0.1.0)

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake")
find_package(LIBYANG REQUIRED)
find_package(SYSREPO REQUIRED)

include_directories(
    ${SYSREPO_INCLUDE_DIRS}
    ${LIBYANG_INCLUDE_DIRS}
)

add_executable(
    ${PROJECT_NAME}
    ${PROJECT_NAME}.c
)

target_link_libraries(
    ${PROJECT_NAME}
    ${SYSREPO_LIBRARIES}
    ${LIBYANG_LIBRARIES}
)
