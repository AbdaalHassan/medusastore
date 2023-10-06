export function customMiddleware(req, res, next) {
    // TODO perform an action
    res.json({
        message:"Hello i am middleware"
    })
    next()
  }