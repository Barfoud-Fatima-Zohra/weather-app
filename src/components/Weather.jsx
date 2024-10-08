import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export default function Weather() {
    const { t, i18n } = useTranslation();
    const [dateAndTime, setDateAndTime] = useState("");
    const [temp, setTemp] = useState({
        number: null,
        description: '',
        min_temp: null,
        max_temp: null,
        icon: ''
    });
    const [locale, setLocale] = useState("en");
    let cancelAxios = null;

    // Initialize language
    useEffect(() => {
        const initialLang = "en";
        i18n.changeLanguage(initialLang);
        setLocale(initialLang);
    }, [i18n]);

    // Handle language switch
    const handleLanguageClick = () => {
        const newLocale = locale === "en" ? "fr" : "en";
        setLocale(newLocale);
        i18n.changeLanguage(newLocale);
    };

    // Fetch weather data
    useEffect(() => {
        const currentDay = moment().format('dddd');
        const translatedDay = t(currentDay);
        const todayDate = moment().format('DD/MM/YYYY');
        setDateAndTime(`${translatedDay} ${todayDate}`);

        axios
            .get("https://api.openweathermap.org/data/2.5/weather?lat=31.9314000&lon=-4.4266300&appid={your API KEY}", {
                cancelToken: new axios.CancelToken((c) => {
                    cancelAxios = c;
                }),
            })
            .then((response) => {
                const responseTemp = Math.round(response.data.main.temp - 273.15); // Convert from Kelvin to Celsius
                const responseMinTemp = Math.round(response.data.main.temp_min - 273.15);
                const responseMaxTemp = Math.round(response.data.main.temp_max - 273.15);
                const responseDescription = response.data.weather[0].description;
                const responseIcon = response.data.weather[0].icon;

                setTemp({
                    number: responseTemp,
                    temp_min: responseMinTemp,
                    temp_max: responseMaxTemp,
                    description: responseDescription,
                    icon: responseIcon
                });
            })
            .catch((error) => {
                console.log(error);
            });

        return () => {
            if (cancelAxios) cancelAxios();
        };
    }, [locale, t]);

    return (
        <>
            <div className='weather-container'>
                <div className="weather-header">
                    <div className="city-name">{t('Errachidia')}</div>
                    <div className="current-date">{dateAndTime}</div>
                </div>
                <hr />
                <div className="weather-details">
                    <div className="weather-info">
                        <div className="temperature">{temp.number} °C</div>
                        <div className="cloud-conditions">{t(temp.description.charAt(0).toUpperCase() + temp.description.slice(1))}</div>
                        <div className="temperature-range">
                            <div className="min-temperature">Min: {temp.temp_min} °C</div>
                            <span></span>
                            <div className="max-temperature">Max: {temp.temp_max} °C</div>
                        </div>
                    </div>
                    <div className="weather-icon">
                        <img src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`} alt="weather status" className='image-cloud' />
                    </div>
                </div>
            </div>
            <button onClick={handleLanguageClick} className='button'>
                {locale === "en" ? 'French' : 'English'}
            </button>
        </>
    );
}
