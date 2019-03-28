//
//  State.hpp
//  hw03_isaacfimbres1
//
//  Created by Isaac Fimbres on 3/20/18.
//  Copyright © 2018 Isaac Fimbres. All rights reserved.
//

#ifndef State_h
#define State_h


#include "Graph.h"

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
#include <cmath>
#include "nlohmann/json.hpp"


// for convenience
using json = nlohmann::json;

using namespace std;

class Graph;


class State{
    
    
private:
    
public:
    
    State(char* current);
    State(State* parent);
    State(json parent);
 
    //g is cost from start to node
    double* g;
    //h is heuristic to goal
    double* h;
    
    char* currentBlocks;
    vector<double> coordinates;
    
    State* parentState;
    vector<State*> childStates;
    Graph* graph;
    
    State();
    
    //f = h+ g;
    double getF();
    void calculateH();
    
    
    
    
};



#endif /* State_hpp */
