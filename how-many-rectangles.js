(function ()
{
  'use strict';
  ////// config
  var width = 400;
  var height = 40;
  var points = [];
  var rects = [];

  function makeGrid(x, y)
  {
    for (var i = 0; i < x; i++)
    {
      for (var j = 0; j < y; j++)
      {
        var point = {
          x: i,
          y: j
        };
        points.push(point);
      }
    }
  }

  //////
  function findRects()
  {

    for (var i = 1; i < points.length; i++)
    {
      //to do: optimize by only checking points that are likely to produce new results

      // looks for all rectangles on horizontal plane
      // check for siblings: left/up
      findRects_ul(points[i]);

      // find diagonal rectangles
      findRects_d(points[i]);
    }

    return rects.length;
  }

  function findLefts(y)
  {
    var lefts = [];
    for (var left = y - 1; left >= 0; left--)
    {
      lefts.push(left);
    }
    return lefts;
  }

  function findUps(x)
  {
    var ups = [];
    for (var up = x - 1; up >= 0; up--)
    {
      ups.push(up);
    }
    return ups;
  }

  function findRects_ul(point)
  {
    //create arrays of points left and up from point
    var lefts = findLefts(point.y);
    var ups = findUps(point.x);

    for (var i = 0; i < lefts.length; i++)
    {
      for (var j = 0; j < ups.length; j++)
      {
        rects.push(
        {
          x: lefts[i],
          y: ups[j],
          x2: point.x,
          y2: point.y
        });
      }
    }
  }

  function findRects_d(point)
  {
    // looks for all rectangles on diagonal plane


    //find all points up and to right or left diagonal
    var diags = findDiags(point);

    if (diags != null)
    {
      //all diags.l are at least one up-left and point has at least one up-right

      for (var i = 0; i < diags.l.length; i++)
      {
        //cycle through left diags
        for (var j = 1; j <= diags.l[i].y; j++)
        {
          //check up and to the right and down
          var up = diags.l[i].y - j;
          var right = diags.l[i].x + 1 + j;
          if (up >= 0 && right < width && point.x + 1 < width)
          {
            rects.push(
            {
              x: point.x,
              y: point.y,
              x2: diags.l[i].x,
              y2: diags.l[i].y,
              y3: up,
              x3: right - 1,
              y4: up + 1,
              x4: right
            });
          }
        }

      }

    }
    //

  }

  function findDiags(point)
  {
    // x must be within width-1 and y needs to be at least in 3rd row
    if (point !== null && point.x < width - 1 && (point.y) > 1)
    {
      var lpoints = [];
      var rpoints = [];
      var y = point.y - 1;
      var tmp_y = y;
      for (var mod = 1; mod <= tmp_y; mod++)
      {
        if (point.x - mod >= 0)
        {
          lpoints.push(
          {
            x: point.x - mod,
            y: y
          });
        }
        if (point.x + mod <= width)
        {
          rpoints.push(
          {
            x: point.x + mod,
            y: y
          });
        }
        y--;
      }

      if (rpoints.length > 0 && lpoints.length > 0)
      {
        // if there is at least one L and one R diag
        return {
          l: lpoints,
          r: rpoints
        };
      }
      return;
    }
  }


  makeGrid(width, height);

  console.log("there are " + findRects() + " rectangles in this point grid");
}())
