import fetch from 'node-fetch';
import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button, useAccordionToggle } from 'react-bootstrap';
import { GATEWAYSERVERIP } from '../../../../dataServerEnv';
import Comment from './Comment';
import classes from './styles/session.module.css';

const subteam_enum = function (num) {
  switch (num) {
    case 1:
      return 'Frame & Body';
      break;
    case 2:
      return 'Suspension';
      break;
    case 3:
      return 'Powertrain';
      break;
    case 4:
      return 'Electrical';
      break;
    case 5:
      return 'Aero';
      break;
  }
};

function CommentsToggle({ children, eventKey }) {
  const toggleComments = useAccordionToggle(eventKey, null);
  return (
    <Button className={classes.histBtn} onClick={toggleComments}>
      {children}
    </Button>
  );
}

export default function Session({ id, name, date, subteam, index }) {
  const [runs, setRuns] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments().then((res) => {
      if (res) {
        setComments(res);
      }
    });
    // Fetch for runs here
    // Should return
    //[{id, name, car, driver}]
  }, []);

  const getSubteamNames = (subteams) => {
    const teamNums = subteams.split(',');
    let teams = '';
    teamNums.forEach((num, index) => {
      teams += `${index !== 0 ? ', ' : ''}${subteam_enum(parseInt(num))}`;
    });

    return teams;
  };

  const getComments = async () => {
    try {
      let res = await fetch(GATEWAYSERVERIP + `/session/getComments/${id}`, {
        method: 'GET',
      });

      res = await res.json();
      return res;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const renderComments = () => {
    return comments.map((comment, index) => {
      const date = new Date(parseInt(comment.date));
      return (
        <Comment
          content={comment.content}
          commenter={comment.commenter}
          date={`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
          key={index}
        />
      );
    });
  };

  return (
    <>
      <Accordion>
        <Card className={classes.csvBox}>
          <Card.Header className={classes.cardBody}>
            <div className={classes.container}>
              <div className={classes.infoContainer}>
                <div className={classes.title}>{name}</div>

                <div className={classes.info}>
                  <div className={classes.label}>Created:</div>
                  <div className={classes.text}>
                    {date.toLocaleDateString() +
                      ' ' +
                      date.toLocaleTimeString()}
                  </div>
                </div>
                <div className={classes.info}>
                  <div className={classes.label}>Subteam:</div>
                  <div className={classes.text}>{getSubteamNames(subteam)}</div>
                </div>
              </div>

              <div className={classes.btnContainer}>
                <Button className={classes.histBtn}>
                  <img
                    width="20px"
                    src={require('../../../../assets/delete-x.svg')}
                  />
                </Button>
                <Button className={classes.histBtn}>
                  <img
                    width="20px"
                    src={require('../../../../assets/edit.svg')}
                  />
                </Button>
                <CommentsToggle eventKey="0">
                  <img
                    width="20px"
                    src={require('../../../../assets/comment.svg')}
                  />
                </CommentsToggle>
              </div>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <div>
                <div className={classes.title}>Comments</div>
                {comments.length === 0 ? (
                  <div>Nothing Yet!</div>
                ) : (
                  renderComments()
                )}
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}
