//
//  hw03_isaacfimbres1.cpp
//  hw03_isaacfimbres1
//
//  Created by Isaac Fimbres on 3/20/18.
//  Copyright © 2018 Isaac Fimbres. All rights reserved.
//

#include "State.h"

#include "nlohmann/json.hpp"

// for convenience
using json = nlohmann::json;

string aStarAlgorithm(char text[]){
    
    json initial = json::parse(text);
    Graph* main = new Graph(initial);
    return main->findSolution();
    
}

int main(int argc, const char * argv[]) {
    char text[] = R"(
    {"start":[-110.92260655557135,32.20918097010039],"target":[-110.92201518570259,32.21029954240352],"nofly":[[[-110.9229833431991,32.2102747424086],[-110.92322605751673,32.21012855381106],[-110.92332890256634,32.20994059670234],[-110.92328776454515,32.20964821820942],[-110.92318491949554,32.20949854790217],[-110.92176565781153,32.209637776106604],[-110.92165869895913,32.20976656199859],[-110.92165458515967,32.20995103878167],[-110.9217409750015,32.210031094623034],[-110.92196723410797,32.21012855381106],[-110.92275708408927,32.210309549177],[-110.9229833431991,32.2102747424086]]],"restricted":[]}
    )";

    cout << aStarAlgorithm(text);
    
    return 0;
}





