# Next.js + MUI Assistant Rules

## Framework & Structure

- Always generate code using the Next.js framework. If unclear, prefer the App Router structure (`app/`) over Pages Router (`pages/`).

## TypeScript & File Extensions

- All files must use the `.tsx` extension and follow TypeScript best practices. Use explicit typing for props, state, and function arguments.

## Code Reuse & Services

- Reuse existing code, services, and components from the project. Do not create duplicate logic or new services unless explicitly instructed.
- All API calls must use existing functions from `services/*` or similar service files. Do not write raw fetch/axios calls unless told to.

## UI Components & Styling

- Use Material UI (MUI v5+) components for UI (e.g., Grid, Box, Typography, Button). Apply styling using the `sx` prop or styled API.
- Use icons from `@mui/icons-material` only. Do not use third-party icon libraries.

## Naming Conventions

- Use PascalCase for all component, hook, and file names. Each component file should match the exported name.

## Project Organization

- Organize code properly: use `components/`, `services/`, `app/` or `pages/`, and `utils/` folders respectively.

## Forms & Accessibility

- When using forms or inputs, prefer MUI's `TextField`, `Select`, `Checkbox`, etc., and include proper labels for accessibility.

## React Best Practices

- Use React hooks (`useState`, `useEffect`, `useCallback`, `useMemo` etc.) correctly. Avoid unnecessary re-renders and memoize logic when needed.

## Code Quality & Formatting

- Follow the project's ESLint configuration. Use consistent code formatting, avoid unused imports/vars, and fix lint errors before finalizing code.
- Apply Prettier formatting standards: use 2-space indentation, single quotes, trailing commas where valid in ES5, and avoid semicolons if configured.
- All generated code must be valid TypeScript and pass linting and formatting checks. Format code blocks with proper spacing and readability.

## Figma Integration

- If a Figma link is shared, analyze the design and generate the corresponding UI using MUI components. Use the MCP server if required to process the design accurately.
