import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { WheelItem } from '../../../../../database/db';
import commonErrorHandlers from '../../../../../middleware/commonErrorHandlers';
import requireApiSession from '../../../../../middleware/requireApiSession';
import requirePlayer from '../../../../../middleware/requirePlayer';
import { ApiError } from '../../../../../types/common-api';



const router = createRouter<NextApiRequest, NextApiResponse<WheelItem | ApiError | null>>();

export default router
    .use(requireApiSession)
    .use(requirePlayer)
    .patch(async (req, res) => {
        try {
            const wheelItem = await WheelItem.findOne({
                where: {
                    id: req.query.itemId
                }
            })
            if (!wheelItem)
                return res.status(404).json({ error: 'А где', status: 404 })
            if (wheelItem.addedById !== req.session.user.id && !req.session.user.isAdmin)
                return res.status(403).json({ error: 'Иди нахуй', status: 404 })

            wheelItem.title = req.body.title === undefined ? wheelItem.title : req.body.title
            //TODO wheelItem.position = req.body.position === undefined ? wheelItem.position : req.body.position
            wheelItem.label = req.body.label === undefined ? wheelItem.label : req.body.label
            wheelItem.title = req.body.title === undefined ? wheelItem.title : req.body.title
            wheelItem.altColor = req.body.altColor === undefined ? wheelItem.altColor : req.body.altColor
            wheelItem.fontColor = req.body.fontColor === undefined ? wheelItem.fontColor : req.body.fontColor
            wheelItem.hours = req.body.hours === undefined ? wheelItem.hours : req.body.hours
            wheelItem.showText = req.body.showText === undefined ? wheelItem.showText : req.body.showText
            wheelItem.deleted = req.body.deleted === undefined ? wheelItem.deleted : req.body.deleted
            wheelItem.imageId = req.body.imageId === undefined ? wheelItem.imageId : req.body.imageId
            wheelItem.imageMode = req.body.imageMode === undefined ? wheelItem.imageMode : req.body.imageMode
            wheelItem.type = req.body.type === undefined ? wheelItem.type : req.body.type
            wheelItem.comments = req.body.comments === undefined ? wheelItem.comments : req.body.comments
            wheelItem.hasCoop = req.body.hasCoop === undefined ? wheelItem.hasCoop : req.body.hasCoop
            wheelItem.maxCoopPlayers = req.body.maxCoopPlayers === undefined ? wheelItem.maxCoopPlayers : req.body.maxCoopPlayers
            wheelItem.hasDifficulty = req.body.hasDifficulty === undefined ? wheelItem.hasDifficulty : req.body.hasDifficulty
            wheelItem.audioId = req.body.audioId === undefined ? wheelItem.audioId : req.body.audioId
            if (req.session.user.isAdmin) {
                wheelItem.wheelId = req.body.wheelId === undefined ? wheelItem.wheelId : req.body.wheelId
                wheelItem.ownedById = req.body.ownedById === undefined ? wheelItem.ownedById : req.body.ownedById
            }
            await wheelItem.save()
            res.json(wheelItem)
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: 500 })
        }
    })
    .handler(commonErrorHandlers)