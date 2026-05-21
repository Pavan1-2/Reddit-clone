import express from 'express'
import verifyToken from '../middlewares/authenticate.js'
import Community from '../models/Community.js'

const router = express.Router()
router.use(verifyToken)


router.post("/", async (req, res) => {
    const { name, description } = req.body
    const ifNameExist = await Community.findOne({ name })
    if (ifNameExist) {
        res.status(400).json({ message: "Community already exists" })
    }
    const ownerId = req.user.userId
    const newCommunity = new Community({
        name,
        description,
        ownerId
    })

    const created = await newCommunity.save()
    res.status(200).json({ message: `${created.name} has been created` })
})

router.get("/", async (req, res) => {
    try {
        const communities = await Community.find().sort({ createdAt: -1 });
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: "Error fetching communities" });
    }
});


router.get("/r/:name", async (req, res) => {
    const { name } = req.params
    const community = await Community.findOne({ name }).populate("ownerId", "-passwordHash -email")
    if (!community) {
        res.status(404).json({ message: "Community Not found" })
    }
    res.status(200).json(community)
})






export default router