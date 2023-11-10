"use client"

import { useLoadScript, GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { use, useEffect, useMemo, useState } from 'react';
import { save } from './actions/save';
import { getMarkers } from './actions/get-markers';

const Home: NextPage = () => {
  const [newMarker, setNewMarker] = useState<{ lat: any, lng: any } | null>(null)
  const [markers, setMarkers] = useState<{ lat: any, lng: any, spotifyID: string }[]>([])

  const [activeMarker, setActiveMarker] = useState<{ lat: any, lng: any } | null>(null);
  const [center, setCenter] = useState<{ lat: any, lng: any }>({ lat: 37.517235, lng: 127.047325 })


  const onMapClick = (e : any) => {
    setNewMarker({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    })
  };



  useEffect(() => {
    getMarkers().then(res => {
      setMarkers(res)
    })
  }, [])


  // const markers = use(getMarkers())


  const libraries = useMemo(() => ['places'], []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDWxqDaMcqcMzuXwrSHa0wO9l2pQ41rLCw",
    libraries: libraries as any,
  });



  if (!isLoaded) {
    return <p>Loading...</p>;
  }



  return (
    <form action={async (formData: FormData) => {
      if (newMarker == null) {
        alert('위치를 선택해주세요.')
        return
      }

      if (!formData.get('link')) {
        alert('링크를 입력해주세요.')
        return
      }
      const raw = formData.get('link') as string
      const regex = /track\/([^?]+)/;
      const match = raw.match(regex);

      if (match && match[1]) {
        const trackId = match[1];

        await save({
          loc: newMarker,
          spotifyID: trackId
        })
      } else {
        alert("Spotify Track ID not found");
        return
      }
    }}> 
      <GoogleMap
        center={center}
        options={mapOptions}
        zoom={14}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: "80%", height: "600px", margin: "auto" }}
        onLoad={() => console.log('Map Component Loaded...')}
        onClick={onMapClick}
      >
        {
          newMarker && (
            <MarkerF
              position={{
                lat: newMarker.lat,
                lng: newMarker.lng
              }} />
          )
        }

        {
          markers && (
            <>
              {markers.map((e, i) =>
                <MarkerF key={i} position={{
                  lat: e.lat,
                  lng: e.lng
                }}
                  onClick={(e) => {
                    setActiveMarker({ lat: e.latLng?.lat(), lng: e.latLng?.lng() });
                    setCenter({ lat: e.latLng?.lat(), lng: e.latLng?.lng() });

                  }}> {
                    activeMarker?.lat == e.lat && activeMarker?.lng == e.lng && (
                      <InfoWindowF 
                        position={e}
                        options={{ pixelOffset: new window.google.maps.Size(0, -25) }}

                        onCloseClick={() => {
                          setActiveMarker(null);
                        }}>
                        <div> 
                          <figure> <iframe src={`https://open.spotify.com/embed/track/${e.spotifyID}`} width="400"
                height="152" allow="encrypted-media"></iframe>
                           </figure>
                           
                        </div>    
                        </InfoWindowF>
                    )
                  }
                </MarkerF>
              )}
            </>
          )
        }
      </GoogleMap>

      <div className='container'>
        <input type="url" name="link" className='ring  rounded-xl outline-none'></input>
        <button type='submit'>저장하기</button>
      </div>
    </form>
  );
};

export default Home;
