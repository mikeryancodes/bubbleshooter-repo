# snood

## Description

This is a bubble shooter a la Bust a Move or Snood.  A player shoots circles at a cluster of circles anchored to the ceiling.  When the player creates a cluster of 3 or more circles of the same color, the cluster disappears.  Circles no longer attached to the ceiling wind up falling.

The player must eliminate circles at a decent rate, or else the ceiling will lower.  A meter to the right of the board keeps track of how close the ceiling is to lowering.  A player can reduce the meter by clearing circles.

## Cool Features

### Triangular Grid

This game uses a coordinate system to locate the vertices of tessellated equilateral triangles using integers.  When a circle collides with another circle or the ceiling, it "snaps" into the right position.  A dense collection of adjacent circles will resemble a honeycomb formation.

Coordinates in this system are used as keys in a hash table to keep track of the circles on the game board.  A rounding function is used to determine the closest triangular grid point to the circle being fired, and only the six neighboring locations need to be checked to see if there is a collision.  The neighboring locations can be determined using simple arithmetic on coordinates.

### Breadth-First Search

Breadth-first search is used twice.  First, to identify the region of circles such that (a) all circles are the same color and (b) there is a path from the fired circle to any other circle in the set where are circles along the path are in the set.

Second, to detect the falling region.  To do this, we find all circles that can be reached starting from a circle in the top row.  We call this the "safe region."  Next, we go through the list of circles on the game board.  Any circles that aren't in the safe region are added to the falling region.

Because the circles are stored in hashes, identifying whether a circle is in the safe region happens in constant time.
