if (LIBYANG_LIBRARIES AND LIBYANG_INCLUDE_DIRS)
  # in cache already
  set(LIBYANG_FOUND TRUE)
else (LIBYANG_LIBRARIES AND LIBYANG_INCLUDE_DIRS)

  find_path(LIBYANG_INCLUDE_DIR
    NAMES
      libyang/libyang.h
    PATHS
      /usr/include
      /usr/local/include
      /opt/local/include
      /sw/include
      ${CMAKE_INCLUDE_PATH}
      ${CMAKE_INSTALL_PREFIX}/include
  )

  find_library(LIBYANG_LIBRARY
    NAMES
      yang
      libyang
    PATHS
      /usr/lib
      /usr/lib64
      /usr/local/lib
      /usr/local/lib64
      /opt/local/lib
      /sw/lib
      ${CMAKE_LIBRARY_PATH}
      ${CMAKE_INSTALL_PREFIX}/lib
  )

  if (LIBYANG_INCLUDE_DIR AND LIBYANG_LIBRARY)
    set(LIBYANG_FOUND TRUE)
  else (LIBYANG_INCLUDE_DIR AND LIBYANG_LIBRARY)
    set(LIBYANG_FOUND FALSE)
  endif (LIBYANG_INCLUDE_DIR AND LIBYANG_LIBRARY)

  set(LIBYANG_INCLUDE_DIRS ${LIBYANG_INCLUDE_DIR})
  set(LIBYANG_LIBRARIES ${LIBYANG_LIBRARY})

  # show the LIBYANG_INCLUDE_DIRS and LIBYANG_LIBRARIES variables only in the advanced view
  mark_as_advanced(LIBYANG_INCLUDE_DIRS LIBYANG_LIBRARIES)

endif (LIBYANG_LIBRARIES AND LIBYANG_INCLUDE_DIRS)