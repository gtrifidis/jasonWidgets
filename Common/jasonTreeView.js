/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function jasonTreeNode(text) {
    this.Data = [];
    this.Text = text;
    this.Children = [];
    this.Level = null;
    this.Parent = null;
}

/*jasonGrid group tree view*/
function jasonGridGroupTreeView() {
    this.findNode = function (nodeText,Nodes) {
        for (var i = 0; i <= Nodes.length - 1; i++) {
            if (Nodes[i].Text == nodeText) {
                return Nodes[i];
            }
            if (Nodes[i].Children.length > 0) {
                var result = this.findNode(nodeText, Nodes[i].Children);
                if (result)
                    return result;
            }
        }
    }
    this.findNodeFromPath = function (nodePath,Nodes) {
        for (var i = 0; i <= Nodes.length - 1; i++) {
            if (Nodes[i].NodePath == nodePath) {
                return Nodes[i];
            }
            if (Nodes[i].Children.length > 0) {
                var result = this.findNodeFromPath(nodePath, Nodes[i].Children);
                if (result)
                    return result;
            }
        }
    }
    this.Items = [];
    this.AddNode = function (parentNode,text) {
        var newTreeNode = new jasonGridGroupTreeNode(text);
        newTreeNode.Level = parentNode ? parentNode.Level + 1 : 0;
        newTreeNode.Parent = parentNode;
        newTreeNode.NodePath = "";
        if (parentNode) {
            parentNode.Children.push(newTreeNode);
        } else {
            this.Items.push(newTreeNode);
        }
        if (parentNode) {
            while (parentNode) {
                newTreeNode.NodePath = parentNode.Text +  newTreeNode.NodePath;
                parentNode = parentNode.Parent;
            }
            newTreeNode.NodePath = newTreeNode.NodePath + text;
        }
        else
            newTreeNode.NodePath =  text;
        return newTreeNode;
    }
    this.RemoveNode = function (node) {

    }

    this.FindNode = function (nodeText, startingNode) {
        var nodes = startingNode ? startingNode.Children : this.Items;
        return this.findNode(nodeText, nodes);
    }
    this.FindNodeFromPath = function (nodePath, startingNode) {
        var nodes = startingNode ? startingNode.Children : this.Items;
        return this.findNodeFromPath(nodePath, nodes);
    }
}