import React, {useEffect, useState} from 'react'
import '../styles/home.css';
import {useNavigate, useParams} from "react-router-dom";
import {apiFetchProfile} from "../app/InterNationsAPI";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const {slug} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (profile === null) {
            apiFetchProfile({slug: slug}).then(profile => {
                if (profile.hasOwnProperty('status') && profile.hasOwnProperty('message')) {
                    //handle exception
                    if (profile.status === 404) {
                        navigate("/");
                    }
                } else {
                    setProfile(profile)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }, [profile])


    return (
        <div>
            {profile !== null && (
                <section className="mvh-75 pt-5 white">
                    <div className="bg-white ms-5 me-5 main container">
                        <div className="row ps-3">
                            <h1>{profile.name}</h1>
                            <h4>{profile.createdAt}</h4>
                        </div>
                    </div>
                </section>
            )
            }
        </div>
    )
}

Home.propTypes = {};

export default Home;
