# @xter-pragmatic-dnd/pragmatic-drag-and-drop-hitbox

A fork of the original package @atlaskit/pragmatic-drag-and-drop-hitbox, especially the `list-item`.
It has been necessary to review the Collision detection used in the context of `list-item`. In the original package, the Operation `reorder-before` and `reorder-after` fire as soon as the draggable become 1/4 the height-size close to the top or bottom edge of a droppable.
In the case where we deal with elements with variable sizes it was not suitable enough.

## Exports

### Main entry (`.`)
- `stable()` — Re-exports memoization helper from `src/memoize.ts`

### Subpath exports
- `./types` — Re-exports types from `@atlaskit/pragmatic-drag-and-drop-hitbox/types`
- `./list-item` — Re-exports `attachInstruction()`, `extractInstruction()`, and related helpers (wraps Atlaskit with app-specific utilities)

## Files

- **src/types.ts** — Re-exports Atlaskit hitbox types (Edge, etc.)
- **src/memoize.ts** — `stable<T>()` function for caching stable object references based on shallow equality
- **src/list-item.ts** — Instruction attachment and extraction logic for drag-and-drop operations

## Development

This package is part of the Xter monorepo workspace. It exports TypeScript sources directly (no build step).

**Dependencies:**
- `@atlaskit/pragmatic-drag-and-drop@^1.7.7`
- `@atlaskit/pragmatic-drag-and-drop-hitbox@^1.1.0`

**Dev dependencies:**
- `typescript@~5.9.3`

You can type-check this package independently:
```sh
npm run build -w packages/pragmatic-drag-and-drop-hitbox
```

Or from the workspace root, all packages and apps together.
