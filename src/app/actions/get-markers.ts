'use server'
import { db } from "@/lib/db"

export const getMarkers = async()=>{

    const markers =await db.musicSpot.findMany()
    return markers.map(m => ({lng: m.lng, lat: m.lat, spotifyID: m.spotifyID }))
}