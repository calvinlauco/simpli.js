## Version History
* 6 Jul, 2016. Version 1.2.4
  * Compatible with Node.js module
* 6 Jul, 2016. Version 1.2.3
  * Rename simpli.argc() to simpli.argv()
  * Introduce custom data type simpli.Type (experimental)
  * Variable-length argument must now be the last signature in the declaration
  * Option argument must now appear at the end of the declaration
  * 2nd argument of simpli.isDecimal() is changed back to exact match
  * Update new unit test
  * Update document
* Version 1.2.2 (Skipped)
* Version 1.2.1 (Internal)
  * 2nd and 3rd arguments of simpli.isDecimal() now become an inclusive upper bound (in previous version it is an exact match)
* 16 May, 2016. Version 1.2.0
  * Update to version 1.2.0 (1.1.0 skipped)
  * A complete redesign of Simpli.js
  * Redesign run-time argument checking
  * Remove DOM manipulation
  * Temporarily remove some data structures, and they will be added back in the future version
  * Update new unit test
  * Update document
* 20 Feb, 216. Version 1.0.6
  * Update to version 1.0.6
  * Redesign simpli.extend()
  * Add several simpli(...) method
* 7 Feb, 2016. Version 1.0.5
  * Update to version 1.0.5 (1.0.4 skipped)
  * Rename class to ucfirst name
  * Add simpli.BinaryTreeNode
  * Add simpli.BinaryTree
  * Add simpli.binarySearch()
  * Redesign simpli.istype to support typed array and object class
  * Redesign simpli.getClassName()
  * Redesign simpli.isObject()
  * Add primitive type check functions
  * Update unit test
* 2 Feb, 2016. Version 1.0.3
  * Update to version 1.0.3
  * Standardize simpli(...)
  * Add several simpli(...) method
  * Add simpli.exist()
  * Add queue and stack datastructure
* 29 Jan, 2016, Version 1.0.2
  * Update to version 1.0.2
  * Redesign simpli(...) functions binding mechanism
  * Add simpli.iterativeIsset()
  * Add simpli.inRange()
* 28 Jan, 2016, Version 1.0.1
  * Fix simpli.getClass() fails to recognize Window object because IE11 has different Window objects under "use strict" and non-strict environment
* 27 Jan, 2016, Version 1.0.0
  * First published