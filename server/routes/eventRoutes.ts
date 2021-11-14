import eventRepository from "../db/Repositories/EventRepository";
import express from 'express';
const router = express.Router()
import { Event } from "../db/models/Event";
import axios, { AxiosError } from "axios";
import { body, validationResult } from 'express-validator';
import { DailyPostResponse } from "server/dto/DailyDTOs";
import checkJwt from "../auth0/check-jwt-middleware";


router.get("/", async (req: express.Request, res: express.Response) => {
    eventRepository.getAll().then(events => {
        res.send(events);
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    })
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
    eventRepository.findOne(req.params.id).then(event => {
        res.json(event);
    }).catch(err => {
        console.log(err);
        res.status(400).send(err);
    })
});

router.post("/",
    body("name")
        .notEmpty()
        .withMessage("Please enter a room name")
    , async (req: express.Request, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const event: Event = req.body;
            event.creatorId = req.oidc.user.sub;

            const dailyPostBody = {
                "name": event.name,
                // "properties":
                // {
                //     "start_audio_off": true,
                //     "start_video_off": true
                // }
            };
            const dailyResponse: DailyPostResponse = (await axios.post("https://api.daily.co/v1/rooms/",
                dailyPostBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + process.env.DAILY_API_KEY,
                    },
                }
            )).data;

            event.id = dailyResponse.id;
            event.name = dailyResponse.name;
            event.eventUrl = dailyResponse.url;

            eventRepository.insertItem(event).then(event => {
                res.json(event);
            }).catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
        } catch (e: any | AxiosError) {
            if (axios.isAxiosError(e)) {
                res.status(500).send(e.response.data);
            } else {
                console.log(e);
                res.status(500).send(e.message);
            }
        }

    });

export default router;