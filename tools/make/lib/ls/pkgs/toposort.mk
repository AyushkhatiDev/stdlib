#/
# @license Apache-2.0
#
# Copyright (c) 2021 The Stdlib Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#/

# VARIABLES #

# Define the path of the executable:
LIST_PKGS_TOPOSORT ?= $(TOOLS_PKGS_DIR)/pkgs/toposort/bin/cli

# Define the command flags:
LIST_PKGS_TOPOSORT_FLAGS ?=

# Define the directory from which to search for packages:
LIST_PKGS_TOPOSORT_DIR ?= $(SRC_DIR)


# RULES #

#/
# Prints a topological sort of all package names.
#
# @param {string} [LIST_PKGS_TOPOSORT_DIR] - absolute path of the directory from which to search for packages (default: source directory)
#
# @example
# make list-pkgs-toposort
#
# @example
# make list-pkgs-toposort LIST_PKGS_TOPOSORT_DIR=$PWD/lib/node_modules/\@stdlib/utils
#/
list-pkgs-toposort: $(LIST_PKGS_TOPOSORT) $(NODE_MODULES)
	$(QUIET) NODE_PATH="$(NODE_PATH)" $(NODE) "$(LIST_PKGS_TOPOSORT)" $(LIST_PKGS_TOPOSORT_FLAGS) "$(LIST_PKGS_TOPOSORT_DIR)"

.PHONY: list-pkgs-toposort

#/
# Prints a topological sort of all standalone package names.
#
# @param {string} [LIST_PKGS_STANDALONES_TOPOSORT_DIR] - absolute path of the directory from which to search for packages (default: source directory)
#
# @example
# make list-pkgs-standalones-toposort
#
# @example
# make list-pkgs-standalones-toposort LIST_PKGS_STANDALONES_TOPOSORT_DIR=$PWD/lib/node_modules/\@stdlib/utils
#/
list-pkgs-standalones-toposort: $(LIST_PKGS_TOPOSORT) $(NODE_MODULES)
	$(QUIET) NODE_PATH="$(NODE_PATH)" $(NODE) "$(LIST_PKGS_TOPOSORT)" $(LIST_PKGS_TOPOSORT_FLAGS) "$(LIST_PKGS_STANDALONES_TOPOSORT_DIR)" | NODE_PATH="$(NODE_PATH)" $(NODE) "$(TOOLS_PKGS_DIR)/pkgs/name2standalone/bin/cli"

.PHONY: list-pkgs-standalones-toposort
