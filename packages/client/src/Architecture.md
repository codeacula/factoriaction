# Architecture

The `src` directory is broken down into these elements:

- An `assets` directory to hold things like images and binary files used in the project
- A `components` directory for Vue 3 components
- A `data` directory to hold .json files needed for the app
- A `logic` directory where the majority of the client logic resides
- A `router` directory for the Vue 3 router
- A `sass` directory for SASS/SCSS files
- A `views` directory for Vue 3 components which are targeted by the router
- The root directory contains random files needed for the client app to build, and this file.

## Logic

The logic directory contains the majority of the logic needed to run the app. Below is an explaination of the files, in general order of when they get used.

### PlanningBoardController

This handles most of the interaction between the Vue client and the logic. An instance of this is created in `PlannerCanvas.vue`, where all the interactions as mapped and implemented.

### Buildable

Buildable items are anything that can be built in Satisfactory. They come from `data/buildables.json`.

### Placeable

A placeable item is a buildable with its associated image and position/rotation information. PlanningGrids expect to be given placables when adding items to their internal collection.

### PlacedItem

This is a placeable that has been put into a grid. A PlacedItem includes helper functions for space management, like if it's inside a box, PlacedItem equality, and more

### Vec3

A basic Vec3 class to store points on the grid

### Rotation

An enum to specify which way a buildable is pointing. The output location is always considered "up".

### BoundingBox

This is a class to help with finding items inside of the 2D space. Many items accept a BoundingBox to determine if they're inside it.

### GridCamera

This acts as the camera on our 2d grid, specifing where the user currently is and the viewport they can see. The camera is moved around using the mouse or keystrokes, and is usually the same size as the `PlannerCanvas.vue` is. The GridCamera allows us to zoom by changing the position's z-index.

### PlanningGrid

Contains all placed items, and includes helper functions for managing or discovering them. When discussing grids, there are two primary grids:

- The _planning grid_ which is where PlacedItems are stored. This is where the buildables appear when dragging the map around
- The _local grid_, which is just the grid on the viewport. This holds the ghost of the buildable before its placed, allowing the user to see what it'll look like before placing

### GridRenderer

Takes a bunch of

### CurrentView

H
