//
//  Graph.hpp
//  hw03_isaacfimbres1
//
//  Created by Isaac Fimbres on 3/20/18.
//  Copyright © 2018 Isaac Fimbres. All rights reserved.
//

#ifndef Graph_h
#define Graph_h

#include "State.h"

#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <iostream>
#include <cstdlib>
#include <sstream>
#include <fstream>
#include <vector>
#include <cctype>
#include <ctime>
#include <queue>
#include <cstring>
#include "nlohmann/json.hpp"
#include <limits>
#include <iomanip>  





// for convenience
using json = nlohmann::json;

using namespace std;

class State;

class Graph{
    
private:
    
public:
    State* initialState;
    State* goalState;
    
    vector<State*> states;
    vector<State*> openList;
    vector<State*> visitedList;
    vector<State*> pathToGoal;
    vector<vector<State*>> noFlyZones;
    vector<vector<State*>> restrictedZones;
    
    
    Graph(char* initial);
    Graph(json initial);
    
    
    void findSolution();
    void clearOpenList();
    void clearVisitedList();
    void clearPathToGoal();
    
    
    State* createChildren(State* parent);
    
    bool foundGoal(char* current);
    
    State* getNextCell();
    
    bool moveApplies(int move, State* newState);
    
    void applyMove(int move, State* newState);
    
    void printSolution(State* goal);
    
    bool pointInPolygon(int polyCorners, vector<double> polyX, vector<double> polyY, double x, double y);
    
    
    
    
};





#endif /* Graph_hpp */
