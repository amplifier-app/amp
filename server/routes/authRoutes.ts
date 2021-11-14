import express from 'express';
const router = express.Router()

router.get("/user", async (req: express.Request, res: express.Response) => {
    res.send(req.oidc.user)
});

router.get("/login", (req: express.Request, res: express.Response) => {
    res.oidc.login({ returnTo: '/dashboard' })
});
router.get("/logout", (req: express.Request, res: express.Response) => {
    res.oidc.logout({ returnTo: 'https://amplifier.community/' })
});

export default router;