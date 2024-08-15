import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/imageOfTheDay.css"

function ImageOfTheDay() {
    const [photoData, setPhotoData] = useState(null);
    const [previousPhotos, setPreviousPhotos] = useState([]);

    useEffect(() => {
        fetchPhoto();
        fetchPreviousPhotos();

        async function fetchPhoto() {
            try {
                const res = await fetch(
                    `https://api.nasa.gov/planetary/apod?api_key=Z5A5dcFOEepXKtB6VOBr3IVCDMEd1elr3HfLuwaa`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch photo");
                }
                const data = await res.json();
                setPhotoData(data);
            } catch (error) {
                console.error("Error fetching photo:", error);
            }
        }

        async function fetchPreviousPhotos() {
            try {
                const currentDate = new Date();
                const previousDates = [];
                for (let i = 1; i <= 10; i++) {
                    const date = new Date(currentDate);
                    date.setDate(date.getDate() - i);
                    previousDates.push(date.toISOString().split('T')[0]);
                }

                const requests = previousDates.map(date =>
                    fetch(`https://api.nasa.gov/planetary/apod?api_key=Z5A5dcFOEepXKtB6VOBr3IVCDMEd1elr3HfLuwaa&date=${date}`)
                );
                const responses = await Promise.all(requests);
                const data = await Promise.all(responses.map(res => res.json()));
                setPreviousPhotos(data);
            } catch (error) {
                console.error("Error fetching previous photos:", error);
            }
        }
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, 
        autoplaySpeed: 4000, 
    };

    if (!photoData) return null;

    return (
            <div className="container-fluid">
            <br></br>               
            <div className="row">
                <Slider {...settings}>
                    {previousPhotos.map((photo, index) => (
                        <div className="col-md-12" key={index}>
                            <div className="row">
                                <div className="col-md-6">
                                    {photo.media_type === "image" ? (
                                        <img src={photo.url} alt={photo.title} className="img-fluid" style={{ minWidth: "90%", height: "650px", objectFit: "cover" ,borderRadius: "10px"}} />
                                    ) : (
                                        <iframe
                                            title={`space-video-${index}`}
                                            src={photo.url}
                                            frameBorder="0"
                                            gesture="media"
                                            allow="encrypted-media"
                                            allowFullScreen
                                            className="img-fluid mx-auto d-block"
                                            style={{ maxWidth: "100%", height: "100%" }}
                                        />
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <h2>{photo.title}</h2>
                                    <p>{photo.date}</p>
                                    <br></br>
                                    <p>{photo.explanation}</p>
                                    <p style={{ fontSize: '20px', color: '#000', marginTop: '10px' }}>&copy; {photoData.copyright}</p>
                                    <br></br>
                                    {photo.media_type === "image" ? (
                                    <button className="btn btn-primary" onClick={() => window.open(photo.hdurl, '_blank')}>
                                        <u>View Full Image</u>
                                    </button>
                                ) : (
                                    <button className="btn btn-primary" onClick={() => window.open(photo.url, '_blank')}>
                                        <u>View Full Video</u>
                                    </button>
                                )}
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            <br></br>
            <br></br>
            <br></br>

            <div className="container-fluid">
                <br></br>
                <div className="row">
                    <div className="col-md-6">
                        <h1>{photoData.title}</h1>
                        <p className="date">{photoData.date}</p>
                        <p className="explanation">{photoData.explanation}</p>
                        <p className="copyright">&copy; {photoData.copyright}</p>
                        {photoData.media_type === "image" ? (
                            <p><u>View Full Image</u>: <a href={photoData.hdurl} target="_blank" rel="noopener noreferrer">{photoData.hdurl}</a></p>
                        ) : (
                            <p><u>View Full Video</u>: <a href={photoData.url} target="_blank" rel="noopener noreferrer">{photoData.url}</a></p>
                        )}
                    </div>
                    <div className="col-md-6">
                        {photoData.media_type === "image" ? (
                            <img src={photoData.url} alt={photoData.title} className="img-fluid" style={{ maxWidth: "100%", height: "500px", objectFit: "cover" ,borderRadius: "10px"}} />
                        ) : (
                            <iframe
                                title="space-video"
                                src={photoData.url}
                                frameBorder="0"
                                gesture="media"
                                allow="encrypted-media"
                                allowFullScreen
                                className="img-fluid mx-auto d-block"
                                style={{ maxWidth: "200%", height: "100%" }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageOfTheDay;
