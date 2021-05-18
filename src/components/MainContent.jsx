import React from 'react';
import Harting from './Harting/Harting';
import { Switch, Route } from 'react-router-dom';
import SubMenuContent from './SubMenuContent/SubMenuContent';
import ErrorsInfo from './ErrorsInfo/ErrorsInfo';

function MainContent() {
  return (
    <Switch>
      <Route path="/harting" component={Harting} />
      <Route path="/errors" component={ErrorsInfo} />
      <Route path="/climat/:climatId" component={SubMenuContent} />
      <Route path="/devs/:devsId" component={SubMenuContent} />
      <Route path="/car/:carId" component={SubMenuContent} />
    </Switch>
  );
}

export default MainContent;
