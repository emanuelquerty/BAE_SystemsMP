//
//  State.cpp
//  hw03_isaacfimbres1
//
//  Created by Isaac Fimbres on 3/20/18.
//  Copyright © 2018 Isaac Fimbres. All rights reserved.
//

#include "State.h"

State::State(char* current) {
	this->currentBlocks = current;

	g = new double(0.0);
	h = new double(0.0);
}

State::State(State* parent) {
	g = new double(0.0);
	h = new double(0.0);
	this->parentState = parent;
	this->graph = this->parentState->graph;

}
State::State(json coords) {
	/*cout << coords[0] << endl;
	cout << coords[1] << endl;*/
	this->coordinates.push_back((double)coords[0]);
	this->coordinates.push_back((double)coords[1]);
/*
	cout << this->coordinates[0] << endl;
	cout << this->coordinates[1] << endl;
*/
	//cout << coordinates[1] << endl;

	g = new double(0);     //TODO need to change to doubles not int
	h = new double(0);
}

double State::getF() {
	return (*this->h + *this->g);
}

void State::calculateH() {
	int i, j;

	//distance formula
	*this->h = sqrt(pow((this->coordinates[0] - this->graph->goalState->coordinates[0]), 2) + pow((this->coordinates[1] - this->graph->goalState->coordinates[1]), 2));

	//restricted zones
	for (i = 0; i < this->graph->restrictedZones.size(); ++i) {
		vector<double> polyX;
		vector<double> polyY;

		for (j = 0; j < this->graph->restrictedZones[i].size(); ++j) {
			polyX.push_back(this->graph->restrictedZones[i][j]->coordinates[0]);
			polyY.push_back(this->graph->restrictedZones[i][j]->coordinates[1]);
		}
		if (this->graph->pointInPolygon((int)this->graph->restrictedZones[i].size(), polyX, polyY, this->coordinates[0], this->coordinates[1])) {
			//Adjust heuristic based off restricted zone
			*this->h *= 2;
		}
	}

}
