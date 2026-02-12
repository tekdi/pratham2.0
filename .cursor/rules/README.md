# Cursor Rules Directory

This directory contains rule files that guide AI code generation to follow best practices and avoid common pitfalls.

## Available Rules

### `react-state-management.md`
**Purpose**: Prevents state leakage, infinite API calls, and complex useEffect chains in React components.

**When to reference**:
- Creating new React components with state management
- Working with useEffect hooks
- Implementing API calls with debouncing
- Managing complex state synchronization
- Refactoring components with state issues

**Quick Reference Examples**:

1. **Creating new component**:
   ```
   Create a filter component following react-state-management.md rules
   ```

2. **Fixing state issues**:
   ```
   Fix infinite loops in this component using react-state-management.md patterns
   ```

3. **Specific rule**:
   ```
   Apply rule #2 (useEffect Dependency Management) from react-state-management.md
   ```

4. **Full reference**:
   ```
   @react-state-management.md - Refactor this component
   ```

## How Rules Work

- **Automatic**: Rules in this directory are automatically read by Cursor
- **Explicit**: You can reference them in prompts using `@filename.md` or mentioning the rule name
- **Combined**: Multiple rules work together automatically

## Best Practices

1. Reference rules at the start of your prompt for best results
2. Be specific about which rules to apply
3. Mention the rule file name when you want strict adherence
4. Rules are additive - they work together with other project rules

