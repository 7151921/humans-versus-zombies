import React, {useEffect, useState} from "react";
import Tree from "react-d3-tree";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {CardContent, Grid, Typography} from "@material-ui/core";
import {CardMedia} from "@mui/material";
import {ModServiceCard} from "../CurrentPlayerCard/CardElements";
import {useCenteredTree} from "./helpers";
import axios from "axios";
import defaultProfilePicture from "../../images/default_profile_picture.jpg";

const containerStyles = {
    height: "100vh",
    background: "#010606"
};

const useStyles = makeStyles(
    createStyles({
        button: {
            position: "relative",
            width: "250px",
            height: "150px",
            background: "white",
            color: "black",
            "& > span": {
                flexFlow: "column"
            },
            "&:hover": {
                background: "white"
            }
        },
        name: {
            fontSize: "16px"
        },
        attributes: {
            position: "absolute",
            bottom: "5px",
            right: "10px"
        }
    })
);

const renderForeignObjectNode = ({
                                     nodeDatum,
                                     toggleNode,
                                     foreignObjectProps,
                                     classes
                                 }) => {
    if (nodeDatum.hidden) { // don't render foreignObject for hidden nodes
        return null;
    }

    return (
        <>
            <foreignObject {...foreignObjectProps}>
                <ModServiceCard onClick={() => console.log(nodeDatum.player_name)}>
                    <Grid container direction="row" style={{height: '100%'}} id="my-rendered-view">
                        <Grid item style={{width: '140px'}}>
                            <CardMedia component="img" image={nodeDatum.attributes.game_status === 'HIDDEN_ORIGINAL_ZOMBIE' ? defaultProfilePicture: nodeDatum.attributes.profile_picture}
                                       style={{height: '100%', borderRadius: '5px'}}/>
                        </Grid>
                        <Grid item
                              style={{width: 'calc(100% - 140px)', height: '100%', position: 'relative'}}>
                            <CardContent>
                                <Typography variant="h5" component="h2" style={{
                                    color: '#e4e2de',
                                    fontSize: '1.5rem',
                                    paddingBottom: '3%'
                                }}>
                                    {nodeDatum.name}
                                </Typography>
                                {nodeDatum?.squad_name && <Typography variant="body2" component="p" style={{
                                    color: '#e4e2de',
                                    fontSize: '.75rem',
                                    paddingTop: '3%'
                                }}>
                                    Squad: {nodeDatum?.squad_name ?? ''}
                                </Typography>
                                }
                            </CardContent>
                        </Grid>
                    </Grid>
                </ModServiceCard>
            </foreignObject>
        </>
    );
};

function buildHierarchy(data, playerId) {
    const player = data.find(p => p.id === playerId);
    const isRoot = playerId === 'the_void';
    return {
        name: player?.player_name,
        children: data.filter(p => p.tagged_by === playerId).map(child => buildHierarchy(data, child.id)),
        attributes: {'profile_picture': player?.profile_picture_file_name, 'game_status': player?.game_status, 'id': player?.id},
        hidden: isRoot, // set hidden property to true for the root node
    };
}

export default function FamilyTree({setLoading, setAlert}) {
    const classes = useStyles();
    const [translate, containerRef] = useCenteredTree();
    const nodeSize = {x: 300, y: 300};
    const separation = {siblings: 1.2, nonSiblings: 1.2};
    const foreignObjectProps = {width: nodeSize.x, height: nodeSize.y, x: -140, y: -130};
    const [data, setData] = useState({})

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true)
        const api = axios.create({baseURL: process.env.REACT_APP_BASE_URL});
        api.get("/zombies ")
            .then((res) => {
                const updatedData = JSON.parse(res.data.body).map(item => {
                    if (item.tagged_by === null) {
                        return {...item, tagged_by: 'the_void'};
                    }
                    return item;
                });
                setData(buildHierarchy(updatedData, 'the_void'));
                setLoading(false)
            })
            .catch((error) => {
                console.log(error);
                setAlert('error', 'Error loading Zombie Tree.')
                setLoading(false)
            });
    }, [])

    const pathClassFunc = ({ source, target }) => {
        if (source.data.hidden || target.data.hidden) {
            return "no-link";
        }
        return "tree-link";
    };


    return (
        <div style={containerStyles} ref={containerRef}>
            {Object.keys(data).length > 0 ? (
                <Tree
                    scale={0.2}
                    data={data}
                    translate={translate}
                    nodeSize={nodeSize}
                    separation={separation}
                    transitionDuration="1000"
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    pathClassFunc={pathClassFunc}
                    renderCustomNodeElement={(rd3tProps) =>
                        renderForeignObjectNode({...rd3tProps, foreignObjectProps, classes})
                    }
                    orientation="vertical"
                />
            ) : (
                <div/>
            )}
        </div>
    );
}
