"use client"


import {  LoadScript } from '@react-google-maps/api';
import { useLoadScript, GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { use, useEffect, useMemo, useState } from 'react';
import { save } from './actions/save';
import { getMarkers } from './actions/get-markers';

const Map = () => {
// 작동 안함
  const [map, setMap] = useState<google.maps.Map | null>(null);
   
 
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDWxqDaMcqcMzuXwrSHa0wO9l2pQ41rLCw"
      libraries={['geometry', 'places']}
    >
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        zoom={14}
       
        onLoad={(Map) => setMap(map)}
      ></GoogleMap>
    </LoadScript>
  );
  }
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

  const [inputVisible, setInputVisible] = useState(false);

  const toggleInput = () => {
    setInputVisible(true);
  };

  const submitForm = () => {
    // Add your form submission logic here
    console.log("Form submitted!");
  };


  useEffect(() => {
    getMarkers().then(res => {
      setMarkers(res)
    })

    
  navigator.geolocation.getCurrentPosition(
    (position) => {   
      const { latitude, longitude } = position.coords;
 setCenter({  lat: latitude, lng: longitude})
      
    },

  );
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
            icon={'/spot.png'}
              position={{
                lat: newMarker.lat,
                lng: newMarker.lng
              }} 
              />
          )
          
          
        }
        

        {
          markers && (
            <>
              {markers.map((e, i) =>
                <MarkerF 
                icon={'/spot.png'}   key={i} position={{
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
      

      <div className='container flex mt-2'>  <img
        src="https://w7.pngwing.com/pngs/68/239/png-transparent-number-computer-icons-plus-miscellaneous-game-plus.png"
        alt="plus icon"
        className="icon"
        onClick={toggleInput}
        style={{
          opacity: inputVisible ? 0 : 1,
          width: '40px',//아이콘 크기
          height: '40px',
          cursor: 'pointer',
          transition: 'opacity 0.5s',
         
        }}
      />
   
      <input 
      
      
      style={{


          
opacity: inputVisible ? 1 : 0,
width: inputVisible ? '300px' : '0', 
border: '1px solid #ccc',
borderRadius: '8px 0 0 8px',
outline: 'none',
transition: 'opacity 0.5s, width 0.5s',
display: 'flex', 
alignItems: 'center',
textAlign: 'center',
justifyContent: 'center',

}}
       placeholder="Paste Spotify share link"
        type="url"
        name="link"
        className=" rounded-xl outline-none"
        id="urlInput"
      
      />
   

      <button
        type="submit"
        id="saveButton"
        className='font-bold'
        onClick={submitForm}
        style={{
          opacity: inputVisible ? 1 : 0,
          width: inputVisible ? '150px' : '0',
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: '1px solid #4CAF50',
          borderTopRightRadius: '8px',
          borderBottomRightRadius:'8px',
          cursor: 'pointer',
          outline: 'none',
          transition: 'opacity 0.5s, width 0.5s',
       
        }}
      >
      submit
      </button>
      
    </div>

    </form>
  );
};

export default Home;
