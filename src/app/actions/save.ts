"use server"

import { db } from "@/lib/db"

export const save = async ({
    loc, spotifyID
}: { loc: Record<string, any>, spotifyID: string }) => {
    await db.musicSpot.create({
        data:{
            lat: loc.lat,
            lng: loc.lng,
            spotifyID, 

        }
    })

}