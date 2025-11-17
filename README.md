# xter-pragmatic-dnd

A monorepo containing both a web and desktop app, each one based on the same @atlaskit/pragmatic-drag-and-drop library.
This monorepo is built using npm workspaces standards.

Usage in this monorepo:

- Install dependencies: just execute `npm install` and it will install all the dependencies
- Add new package: the parameter `-w` is important e.g. execute `npm install ./packages/pragmatic-drag-and-drop-hitbox --save-dev -w apps/xter-web` to install local packages @xter-pragmatic-dnd/pragmatic-drag-and-drop-hitbox as a dev dependency in apps/xter-web project
- Build: execute either `npm run web:build` or `npm run desktop:build` depending on which context you are targeting
- Run: execute either `npm run web:dev` or `npm run desktop`

Check out the scripts available in packages.json for extra details.