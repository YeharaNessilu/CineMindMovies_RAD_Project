import { Request, Response, Router } from "express"

const router = Router()

router.get("/", (req, res) => {
  res.send("Hello, from item router!")
})

router.post("/", (req: Request, res: Response) => {
  const data = req.body

  console.log("Item data : ", data)

  res.status(201).json({
    message: "Item data received ..!",
    data: data
  })
})

export default router
