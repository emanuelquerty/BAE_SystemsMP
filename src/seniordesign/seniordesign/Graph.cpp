//
//  Graph.cpp
//  hw03_isaacfimbres1
//
//  Created by Isaac Fimbres on 3/20/18.
//  Copyright © 2018 Isaac Fimbres. All rights reserved.
//

#include "Graph.h"


Graph::Graph(char* initial){
    initialState = new State(initial);
    
}

Graph::Graph(json initial){
    //cout << initial << endl;
    int i;
    int j;
    
    this->initialState = new State(initial["start"]);
    initialState->graph = this;
    
    this->goalState = new State(initial["target"]);
    goalState->graph = this;
    
    this->noFlyZones.resize(initial["nofly"].size());
    this->restrictedZones.resize(initial["restricted"].size());
    //Initialize nofly and restricted
    for(i = 0; i < initial["nofly"].size(); ++i){
        for(j = 0; j < initial["nofly"][i].size(); ++j){
            this->noFlyZones[i].push_back(new State(initial["nofly"][i][j]));
        }
    }
    for(i = 0; i < initial["restricted"].size(); ++i){
        for(j = 0; j < initial["restricted"][i].size(); ++j){
            this->restrictedZones[i].push_back(new State(initial["restricted"][i][j]));
        }
    }
}

void Graph::findSolution(){
    
    State* goal = NULL;
    State* currState = NULL;
    bool firstRun = true;
    
    *initialState->g = 0;
    initialState->calculateH();
    initialState->parentState = NULL;
    
    visitedList.push_back(initialState);
    
    if(*initialState->h == 0){
        cout << initialState->currentBlocks << " : G(n) = " << *initialState->g << " : h(n) = " << *initialState->h << endl;
        cout << "Total cost = " << *initialState->g << endl;
        cout << "Number of states expanded = 0" << endl;
        
        return;
    }
    currState = initialState;
    
    //do while loop
    while(openList.size() != 0 || firstRun == true){
        firstRun = false;
        //cout << "----" << currState->currentBlocks << " : G(n) = " << *currState->g << " : h(n) = " << *currState->h << endl;
        
        goal = createChildren(currState);
        if(goal != NULL){
            printSolution(goal);
            break;
        }
        else{
            currState = getNextCell();
            if(currState == NULL){
                cout << "CurrState is NULL" << endl;
            }
        }
        //++i;
    }
    
}

//returns next cell with smallest F value in open list
State* Graph::getNextCell(){
    
    double bestF = numeric_limits<double>::max();;
    int index = -1;
    
    State* nextCell = NULL;
    
    int i = 0;
    
    for(i = 0; i < (int) openList.size(); ++i){
        if(openList.at(i)->getF() < bestF){
            bestF = openList.at(i)->getF();
            index = i;
        }
        
    }
    
    if(index >= 0 ){
        nextCell = openList.at(index);
        visitedList.push_back(nextCell);
        openList.erase(openList.begin() + index);
        //cout << "Node Erased" << endl;
    }
    
    
    return nextCell;
}

State* Graph::createChildren(State* parent){
    if(parent == NULL){
        cout << "here's thre problem" << endl;
        return NULL;
    }
    
    State* newState = NULL;
    
    int i = 0;
    int j = 0;
    
    //create all of the children nodes
    //for all moves
    for(i = 1; i<9; ++i){
        
        //Check for no fly zone
        if(moveApplies(i, parent)){
            newState = new State(parent);
            applyMove(i, newState);
            *newState->g = *parent->g + *newState->g;
            newState->calculateH();
            
            //cout << *newState->h << endl;
            //check if it at goal state
            
            if(*newState->h < 0.00001){
                states.push_back(newState);
                return newState;
                
            }
            
            //check if this node is already on open list and check for better g on open list
            for(j = 0; j < (int) openList.size(); ++j){
                //need to check if g value is less
                if(newState->coordinates[0] == openList.at(j)->coordinates[0]
                   && newState->coordinates[1] == openList.at(j)->coordinates[1]){
                    if(*newState->g < *openList.at(j)->g){
                        //cout << newState->currentBlocks << endl << openList.at(j)->currentBlocks << endl;
                        openList.at(j)->parentState = parent;
                    }
                    delete newState;
                    newState = NULL;
                    break;
                }
            }
            
            if(newState != NULL){
                //check if node on visitedList
                for(j = 0; j < (int) visitedList.size(); ++j){
                    //need to check if g value is less
                    if(newState->coordinates[0] == visitedList.at(j)->coordinates[0]
                       && newState->coordinates[1] == visitedList.at(j)->coordinates[1]){
                        delete newState;
                        newState = NULL;
                        break;
                        
                    }
                    
                }
            }
            
            //if not on open list add to openlist
            if(newState != NULL){
                //cout << newState->currentBlocks << " : G(n) = " << *newState->g << " : h(n) = " << *newState->h << endl;
                openList.push_back(newState);
                states.push_back(newState);
                
            }
        }
    }
    
    
    return NULL;
    
    
}



bool Graph::moveApplies(int move, State* parent){
    double x;
    double y;
    double slope;
    double x1;
    double x2;
    double y1;
    double y2;
    
    switch(move){
            //move North
        case 1:{
            x = parent->coordinates[0];
            y = parent->coordinates[1] + 0.00001;
            break;
        }
            //move Northeast
        case 2:{
            x = parent->coordinates[0] + 0.00001;
            y = parent->coordinates[1] + 0.00001;
            
            break;
        }
            //move East
        case 3:{
            x = parent->coordinates[0] + 0.00001;
            y = parent->coordinates[1];
            
            break;
        }
            //move South East
        case 4:{
            x = parent->coordinates[0] + 0.00001;
            y = parent->coordinates[1] - 0.00001;
            
            break;
        }
            //move South
        case 5:{
            x = parent->coordinates[0];
            y = parent->coordinates[1] - 0.00001;
            
            break;
        }
            //move South West
        case 6:{
            x = parent->coordinates[0] - 0.00001;
            y = parent->coordinates[1] - 0.00001;
            
            break;
        }
            //move West
        case 7:{
            x = parent->coordinates[0] - 0.00001;
            y = parent->coordinates[1];
            
            break;
        }
            //move Northwest
        case 8:{
            x = parent->coordinates[0] - 0.00001;
            y = parent->coordinates[1] + 0.00001;
            
            break;
        }
            
        default:{
            cout << "Couldn't apply move, not found\n";
            return false;
        }
            
    }
    
    
    
    //  Globals which should be set before calling this function:
    //
    //  int    polyCorners  =  how many corners the polygon has (no repeats)
    //  float  polyX[]      =  horizontal coordinates of corners
    //  float  polyY[]      =  vertical coordinates of corners
    //  float  x, y         =  point to be tested
   
    int i, j;

    
    for(i = 0; i < this->noFlyZones.size(); ++i){
        vector<double> polyX;
        vector<double> polyY;
        
        for(j = 0; j < this->noFlyZones[i].size() ; ++j){
            polyX.push_back(this->noFlyZones[i][j]->coordinates[0]);
            polyY.push_back(this->noFlyZones[i][j]->coordinates[1]);
        }
        if(this->pointInPolygon((int) this->noFlyZones[i].size(), polyX, polyY, x, y)){
            return false;
        }
    }
    return true;

    
    
    
    
//    //traverse through no fly zones points
//    int i;
//    int j;
//    for(i = 0; i < this->noFlyZones.size(); ++i){
//        for(j = 0; j < this->noFlyZones[i].size() - 1; ++j){
//            x1 = this->noFlyZones[i][j]->coordinates[0];
//            x2 = this->noFlyZones[i][j + 1]->coordinates[0];
//            y1 = this->noFlyZones[i][j]->coordinates[1];
//            y2 = this->noFlyZones[i][j + 1]->coordinates[1];
//            slope = (y2-y1)/(x2-x1);
//
//
//            //[-110.92321010925922,32.20951056772604]
//            //[-110.92321,32.20951
//            if(abs(x - (-110.92321)) <= 0.00001 && abs(y - 32.20951) <= 0.00001){
//                cout << "Found point: " << abs(slope * (x - x1) + y1 - y) << endl;
//            }
//
//            //account for negatives
//            //            if(x <= max(x1, x2) && x >= min(x1,x2) && y <= max(y1,y2) && y >= min(y1,y2)){
//            if(x <= max(x1, x2) && x >= min(x1,x2) && y <= max(y1,y2) && y >= min(y1,y2)){
//
//                //                if(abs(x - (-110.92321)) <= 0.00001 && abs(y - 32.20951) <= 0.00001){
//                //                    cout << "Found point: " << abs(slope * (x - x1) + y1 - y) << endl;
//                //                }
//                // (x,y) is on the line
//                //cout << abs(slope * (x - x1) + y1 - y) << endl;
//                //            if (abs(slope * (x - x1) - y) < 0.00001)
//                //[-110.92320807877464,32.20951241522005]
//                if (abs(slope * (x - x1) + y1 - y) < 1){
//                    return false;
//                }
//            }
//
//
//
//        }
//    }
//
//    // (x,y) isn't on the line
//    return true;
//
    
}



//  Globals which should be set before calling this function:
//
//  int    polyCorners  =  how many corners the polygon has (no repeats)
//  float  polyX[]      =  horizontal coordinates of corners
//  float  polyY[]      =  vertical coordinates of corners
//  float  x, y         =  point to be tested
//
//  (Globals are used in this example for purposes of speed.  Change as
//  desired.)
//
//  The function will return YES if the point x,y is inside the polygon, or
//  NO if it is not.  If the point is exactly on the edge of the polygon,
//  then the function may return YES or NO.
//
//  Note that division by zero is avoided because the division is protected
//  by the "if" clause which surrounds it.

bool Graph::pointInPolygon(int polyCorners, vector<double> polyX, vector<double> polyY, double x, double y) {
    
    int   i, j=polyCorners-1 ;
    bool  oddNodes= false     ;
    
    for (i=0; i<polyCorners; i++) {
        if (((polyY[i]< y && polyY[j]>=y)
             ||   (polyY[j]< y && polyY[i]>=y)) &&  (polyX[i]<=x || polyX[j]<=x)) {
            oddNodes^=(polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x); }
        j=i; }

    
    return oddNodes;
    
}

void Graph::applyMove(int move, State* newState){
    
    int i = 0;
    
    //strcpy(newState->currentBlocks, newState->parentState->currentBlocks);
    
    //set i to position of E
    //    for(i = 0; i< (int) sizeof(newState->currentBlocks); ++i){
    //        if(newState->currentBlocks[i] == 'E'){
    //            break;
    //        }
    //
    //    }
    //The sixth decimal place is worth up to 0.11 m
    switch(move){
            //move North
        case 1:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0]);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1] + 0.00001);
            *newState->g = 0.00001;
            
            break;
        }
            //move Northeast
        case 2:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0] + 0.00001);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1] + 0.00001);
            *newState->g = sqrt(pow(0.00001,2) + pow(0.00001,2));
            
            break;
        }
            //move East
        case 3:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0] + 0.00001);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1]);
            *newState->g = 0.00001;
            
            break;
        }
            //move South East
        case 4:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0] + 0.00001);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1] - 0.00001);
            *newState->g = sqrt(pow(0.00001,2) + pow(0.00001,2));
            
            break;
        }
            //move South
        case 5:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0]);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1] - 0.00001);
            *newState->g = 0.00001;
            
            break;
        }
            //move South West
        case 6:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0] - 0.00001);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1] - 0.00001);
            *newState->g = sqrt(pow(0.00001,2) + pow(0.00001,2));
            
            break;
        }
            //move West
        case 7:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0] - 0.00001);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1]);
            *newState->g = 0.00001;
            
            break;
        }
            //move Northwest
        case 8:{
            newState->coordinates.push_back((double) newState->parentState->coordinates[0] - 0.00001);
            newState->coordinates.push_back((double) newState->parentState->coordinates[1] + 0.00001);
            *newState->g = sqrt(pow(0.00001,2) + pow(0.00001,2));
            
            break;
        }
            
        default:{
            cout << "Couldn't apply move, not found\n";
        }
            
    }
    
}


void Graph::printSolution(State* goal){
    State* currState = goal;
    
    while(currState != NULL){
        this->pathToGoal.push_back(currState);
        
        currState = currState->parentState;
        
    }
    int i = 0;
    cout << "[" << endl;
    
    for(i = (int) this->pathToGoal.size()-1; i >= 0; --i){
        cout << "[" << setprecision(8) << this->pathToGoal.at(i)->coordinates[0] << "," << setprecision(8) << this->pathToGoal.at(i)->coordinates[1] << "]";
        if( i != 0){
            cout << "," << endl;
        }
        
        //        cout << this->pathToGoal.at(i)->coordinates[0] << "," << this->pathToGoal.at(i)->coordinates[1] << " : G(n) = " << *this->pathToGoal.at(i)->g << " : h(n) = " << *this->pathToGoal.at(i)->h << endl;
    }
    cout << "]" << endl;
    
    cout << "Total cost = " << *this->pathToGoal.at(0)->g << endl;
    cout << "Number of states expanded = " << this->states.size() << endl;
    
    
    
}






