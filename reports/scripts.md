# Scripts Lint & IO Contract Report

## Summary

**Overall Status: FAIL** - Critical issues found in script contracts and implementations

- **Total Scripts Reviewed**: 5
- **Scripts Meeting All Criteria**: 1/5 (20%)
- **Critical Issues Found**: 1 (empty implementation file)
- **Path Mismatches**: 3/5 scripts (60%)
- **Documentation Issues**: 1/5 scripts (20%)

---

## Script-by-Script Analysis

### ❌ extract-style.ts - FAIL

**Status**: CLI contract and output path mismatch

#### ✅ Passing Criteria:

- CLI flags properly documented with help examples
- Proper error handling with `process.exit(1)` on failures
- Uses Commander.js for argument parsing
- Validates input URL format

#### ❌ Failing Criteria:

- **Expected**: `--url` flag for URL input
- **Actual**: `<url>` positional argument
- **Expected Output**: `/extract/style/styling.json`
- **Actual Output**: `specs/tokens/design-tokens.json`
- **Path Issue**: `/extract/` directory does not exist in project structure

#### 🔧 Required Fixes:

1. Update to use `--url` flag instead of positional argument
2. Change output path to match expected `/extract/style/styling.json`
3. Create `/extract/style/` directory structure or update expectations

---

### ❌ extract-brand.ts - FAIL

**Status**: CLI contract and output path mismatch

#### ✅ Passing Criteria:

- CLI flags properly documented with help examples
- Proper error handling with `process.exit(1)` on failures
- Uses Commander.js for argument parsing
- Validates input URL format

#### ❌ Failing Criteria:

- **Expected**: `--url` flag for URL input
- **Actual**: `<url>` positional argument
- **Expected Output**: `/extract/brand/branding.json`
- **Actual Output**: `specs/content/site-content.json`
- **Path Issue**: `/extract/` directory does not exist in project structure

#### 🔧 Required Fixes:

1. Update to use `--url` flag instead of positional argument
2. Change output path to match expected `/extract/brand/branding.json`
3. Create `/extract/brand/` directory structure or update expectations

---

### ✅ compose-spec.ts - PASS

**Status**: All IO contracts match expectations

#### ✅ Passing Criteria:

- CLI flags properly documented with help examples
- Expected output path: `specs/composed/build-spec.json` ✓
- Reads from `/extract/*` paths (expects style and brand extraction files)
- Proper error handling with `process.exit(1)` on failures
- Uses Commander.js for argument parsing
- Validates input file existence

#### ✅ All Requirements Met:

- Command-line interface properly documented
- Input/output paths match task specifications
- Error handling implemented correctly

---

### ❌ build-site.ts - FAIL

**Status**: Missing required input file integration

#### ✅ Passing Criteria:

- CLI flags properly documented with help examples
- Proper error handling with `process.exit(1)` on failures
- Uses Commander.js for argument parsing
- Validates input file existence

#### ❌ Failing Criteria:

- **Expected Input**: `/specs/composed/build-spec.json` + `/docs/CLAUDE.md`
- **Actual Input**: Only reads `/specs/composed/build-spec.json`
- **Missing Integration**: CLAUDE.md not read despite being in requirements
- **Output Path**: Task doesn't specify expected output for comparison

#### 🔧 Required Fixes:

1. Add integration to read `/docs/CLAUDE.md` as specified
2. Clarify expected output path requirements
3. Implement CLAUDE.md processing logic

---

### ❌ validate-output.ts - CRITICAL FAIL

**Status**: Complete implementation missing - CRITICAL ISSUE

#### ❌ Failing Criteria:

- **CRITICAL**: File is completely empty - no implementation exists
- **Expected Functionality**: Read `/specs` and `/validation/*` files
- **Expected Behavior**: Return `process.exitCode=1` on violations
- **Actual State**: Empty TypeScript file with no code

#### 🚨 Critical Issues:

1. **No CLI interface** - No Commander.js setup
2. **No file reading logic** - No implementation to read specs/validation files
3. **No validation logic** - No rules or checks implemented
4. **No exit codes** - No error handling or exit code logic
5. **No documentation** - No help text or usage examples

#### 🔧 Required Fixes:

1. **URGENT**: Implement complete CLI interface using Commander.js
2. **URGENT**: Add file reading logic for `/specs/*` and `/validation/*`
3. **URGENT**: Implement validation logic with proper exit codes
4. **URGENT**: Add comprehensive documentation and help examples
5. **URGENT**: Add proper error handling throughout

---

## Path Structure Analysis

### Expected vs Actual Directory Structure

#### Expected Paths (from task description):

```
📁 /extract/
  📁 style/
    📄 styling.json (extract-style.ts output)
  📁 brand/
    📄 branding.json (extract-brand.ts output)
```

#### Actual Project Structure:

```
📁 specs/
  📁 tokens/
    📄 design-tokens.json (extract-style.ts actual output)
  📁 content/
    📄 site-content.json (extract-brand.ts actual output)
  📁 composed/
    📄 build-spec.json (compose-spec.ts output)
```

#### Key Issues:

1. **`/extract/` directory does not exist** in the project
2. **Scripts write to `/specs/` instead** of `/extract/`
3. **Path mismatch affects 2/5 scripts** (40% of target scripts)
4. **Inconsistent directory naming** between expectation and implementation

---

## CLI Flag Analysis

### Commander.js Usage Patterns

All implemented scripts properly use Commander.js with:

- ✅ Descriptive help text and examples
- ✅ Proper argument validation
- ✅ Error handling with meaningful messages
- ✅ Version information
- ✅ Help command support

### Flag Format Issues:

1. **URL Input**: Both extract scripts use `<url>` positional arguments instead of `--url` flags
2. **Inconsistency**: Task expects flag format but implementation uses positional arguments

---

## Exit Code Analysis

### Proper Implementation Found:

All implemented scripts correctly use:

```typescript
process.exit(1); // On errors
// No explicit exit(0) - allows natural termination on success
```

### Coverage:

- ✅ `extract-style.ts`: 3 exit points on validation/input errors
- ✅ `extract-brand.ts`: 2 exit points on validation/input errors
- ✅ `compose-spec.ts`: 3 exit points on validation/input errors
- ✅ `build-site.ts`: 2 exit points on validation/input errors
- ❌ `validate-output.ts`: **NO EXIT CODE LOGIC** (empty file)

---

## Recommendations

### Immediate Actions Required:

1. **CRITICAL**: Implement `validate-output.ts` completely
2. **HIGH**: Fix path mismatches in extract scripts or update expectations
3. **HIGH**: Add CLAUDE.md integration to `build-site.ts`
4. **MEDIUM**: Standardize CLI flag format across extract scripts

### Long-term Improvements:

1. **Create `/extract/` directory structure** to match expectations
2. **Update script outputs** to use consistent paths
3. **Add comprehensive integration tests** for all script contracts
4. **Create script validation workflow** to prevent future mismatches

### Documentation Updates Needed:

1. **Update task expectations** to match actual project structure
2. **Clarify CLI flag conventions** used in the project
3. **Document required directory structure** for all scripts

---

## Conclusion

**CRITICAL ISSUES FOUND**: One script is completely unimplemented, and path mismatches affect multiple core scripts. The IO contract discrepancies will cause integration failures in the pipeline workflow.

**IMMEDIATE REMEDIATION REQUIRED**:

1. **Implement `validate-output.ts`** - This is blocking the validation pipeline
2. **Resolve path inconsistencies** - Either update scripts or update expectations
3. **Add missing CLAUDE.md integration** - Required for proper site building

**OVERALL STATUS**: **FAIL** - Core functionality gaps prevent proper pipeline operation.
