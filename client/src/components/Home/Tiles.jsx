import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom'

export const Tiles = () => {
    const { t } = useTranslation();

    return (
        <div className="tiles">
            <Tile
                title={t('Home.Tile1.Title')}
                description={t('Home.Tile1.Description')}
                url="/auctions"
                t={t}
            />
            <Tile
                title={t('Home.Tile2.Title')}
                description={t('Home.Tile2.Description')}
                url="/service"
                t={t}
            />
            <Tile
                title={t('Home.Tile3.Title')}
                description={t('Home.Tile3.Description')}
                url="/contact"
                t={t}
            />
        </div>
    )
}

const Tile = ({ title, description, url, t }) => {
    return (
        <div className="tile">
            <p className="title">{title}</p>
            <p className="description">{description}</p>
            <NavLink className='NavLink' to={url} >
                <button className="button">
                    {t("Home.Discover")}
                </button>
            </NavLink>
        </div>
    )
}