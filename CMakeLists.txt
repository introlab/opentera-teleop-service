cmake_minimum_required(VERSION 3.16.0)
include(ExternalProject)
project(opentera_teleop_service)


if(NOT CMAKE_BUILD_TYPE )
  MESSAGE(STATUS "not define build type, set to release" )
  set(CMAKE_BUILD_TYPE Release )
elseif(NOT (${CMAKE_BUILD_TYPE} STREQUAL "Release" OR ${CMAKE_BUILD_TYPE} STREQUAL "Debug" ))
  message(FATAL_ERROR "CMAKE_BUILD_TYPE must be either Release or Debug")
endif()

if(UNIX AND NOT APPLE)
    find_package(OpenCV REQUIRED core imgproc)
    # Use system opencv that is shared with ROS
    set(OPENTERA_WEBRTC_USE_SYSTEM_OPENCV ON)
endif()

# Disable tests because of conflicts with gtest with catkin
set(OPENTERA_WEBRTC_ENABLE_TESTS OFF)

# Enable generation of Python doc
set(OPENTERA_WEBRTC_ENABLE_PYTHON_HTML_DOC ON)

# Will install python package automatically
set(OPENTERA_WEBRTC_NATIVE_CLIENT_PYTHON_INSTALL_ON_BUILD ON)

add_subdirectory(submodules/opentera-webrtc-teleop-frontend/teleop-vue/submodules/opentera-webrtc)

add_custom_target(webportal_frontend ALL
	WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/webportal
	COMMAND npm install
	COMMAND npm run build
	COMMENT "Building webportal frontend."
	VERBATIM
)

add_custom_target(teleop_frontend ALL
	WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/submodules/opentera-webrtc-teleop-frontend/teleop-vue
	COMMAND npm install
	COMMAND npm run build
	COMMENT "Building teleop frontend."
	VERBATIM
)

# Make sure venv is installed first
set(PYTHON_ENV_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/venv)

# Python executables should be installed with the opentera package
if(WIN32)
    set(PYTHON_EXECUTABLE ${PYTHON_ENV_DIRECTORY}/bin/python.exe)
    set(PYTHON_PIP_EXECUTABLE ${PYTHON_ENV_DIRECTORY}/bin/pip.exe)
    set(PYBABEL_EXECUTABLE ${PYTHON_ENV_DIRECTORY}/Scripts/pybabel.exe)
else(WIN32)
    set(PYTHON_EXECUTABLE ${PYTHON_ENV_DIRECTORY}/bin/python)
    set(PYTHON_PIP_EXECUTABLE ${PYTHON_ENV_DIRECTORY}/bin/pip)
    # Not sure why, but is installed in .local directory and must be in path
    # You might need to do a symlink in the venv/bin directory...
    set(PYBABEL_EXECUTABLE ${PYTHON_ENV_DIRECTORY}/bin/pybabel)
endif(WIN32)

set(translation_pot_file ${CMAKE_CURRENT_BINARY_DIR}/teleop_service_translations.pot)

# Will always be considered out of date...
add_custom_target(teleop-service-python-translations
    COMMAND ${PYBABEL_EXECUTABLE} extract -F babel.cfg -o ${translation_pot_file} .
    # TO REINITIALIZE TRANSLATION FILES (comment the two lines, or the translations will be overwritten)
    # COMMAND ${PYBABEL_EXECUTABLE} init -i ${translation_pot_file} -d translations -D teleop_service -l fr
    # COMMAND ${PYBABEL_EXECUTABLE} init -i ${translation_pot_file} -d translations -D teleop_service -l en
    COMMAND ${PYBABEL_EXECUTABLE} update -i ${translation_pot_file} -d translations -D teleop_service
    COMMAND ${PYBABEL_EXECUTABLE} compile -d translations -D teleop_service
    DEPENDS ${PYBABEL_EXECUTABLE}
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/babel.cfg
)

# Will always be considered out of date...
add_custom_target(teleop-service-python-translations-compile-only ALL
    COMMAND ${PYBABEL_EXECUTABLE} extract -F babel.cfg -o ${translation_pot_file} .
    COMMAND ${PYBABEL_EXECUTABLE} compile -d translations -D teleop_service
    DEPENDS ${PYBABEL_EXECUTABLE}
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    SOURCES ${CMAKE_CURRENT_SOURCE_DIR}/babel.cfg
)