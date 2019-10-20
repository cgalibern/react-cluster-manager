import React from "react";

function parseApiResponse(data, ok) {
	var alerts = []
	var date = new Date()
	console.log("parse api response", data)
	function fmt(log) {
		if (!Array.isArray(log)) {
			log = [log]
		}
		return log.map((e, i) => (
			<div key={i}>{e}</div>
		))
	}
	if (data.status !== undefined) {
		if ("nodes" in data) {
			for (var node in data.nodes) {
				var _data = data.nodes[node]
				if (_data.status) {
					alerts.push({
						"date": date,
						"level": "error",
						"color": "secondary",
						"body": (<div><strong>{node}</strong><br/><div>{fmt(_data.error)}</div></div>)
					})
				}
				if (_data.info) {
					alerts.push({
						"date": date,
						"level": "success",
						"color": "primary",
						"body": (<div><strong>{node}</strong><br/><div>{fmt(_data.info)}</div></div>)
					})
				}
			}
		} else {
			alerts.push({
				"date": date,
				"level": "error",
				"color": "secondary",
				"body": (<div>{fmt(data.error)}</div>)
			})
		}
	}
	if (data.info) {
		alerts.push({
			"date": date,
			"level": "success",
			"color": "primary",
			"body": (<div>{fmt(data.info)}</div>)
		})
	}
	if (ok && (data.status == 0) && (alerts.length == 0)) {
		alerts.push({
			"date": date,
			"level": "success",
			"color": "primary",
			"body": (<div>{ok}</div>)
		})
	}
	return alerts
}

//
// API calls
//
function apiWhoAmI(callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch('/whoami', {
		headers: headers,
		method: "GET",
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiNodeAction(node, action, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': node
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	if (!options) {
		options = {}
	}
	fetch('/node_action', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			sync: false,
			action: action,
			options: options
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiInstanceAction(node, path, action, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': node
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch('/service_action', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			path: path,
			action: action,
			options: options,
			sync: false,
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiNodeSetMonitor(global_expect, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch('/set_node_monitor', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			global_expect: global_expect
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiObjSetMonitor(path, global_expect, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch('/set_service_monitor', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			path: path,
			global_expect: global_expect
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiObjGetConfig(options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': 'ANY'
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch('/get_service_config', {
		headers: headers,
		method: "POST",
		body: JSON.stringify(options)
	})
	.then(res => res.json())
	.then(data => {
		// {nodes: {n1: {...}} => {...}
		// because the user ask for only one cf data
		var cf = null
		for (var node in data.nodes) {
			cf = data.nodes[node]
			break
		}
		if (callback) { callback(cf) }
	})
	.catch(console.log)
}

function apiPostNode(node, path, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': node,
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch(path, {
		headers: headers,
		method: "POST",
		body: JSON.stringify(options)
	})
	.then(res => res.json())
	.then(data => {
		// {nodes: {n1: {...}} => {...}
		// because the user ask for only one cf data
		var _data = null
		for (var node in data.nodes) {
			_data = data.nodes[node]
			break
		}
		if (callback) { callback(_data) }
	})
	.catch(console.log)
}

function apiPostAny(path, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': 'ANY'
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch(path, {
		headers: headers,
		method: "POST",
		body: JSON.stringify(options)
	})
	.then(res => res.json())
	.then(data => {
		// {nodes: {n1: {...}} => {...}
		// because the user ask for only one cf data
		var _data = null
		for (var node in data.nodes) {
			_data = data.nodes[node]
			break
		}
		if (callback) { callback(_data) }
	})
	.catch(console.log)
}

function apiFetchLogs(path, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': '*'
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
        fetch(path, {
                headers: headers,
                method: "POST",
                body: JSON.stringify(options)
        })
        .then(res => res.json())
        .then(data => {
                // {nodes: {n1: {...}} => {...}
                // because the user ask for only one cf data
                var _data = []
                for (var node in data.nodes) {
                        _data = _data.concat(data.nodes[node])
                }
		_data.sort()
                if (callback) { callback(_data) }
        })
        .catch(console.log)
}

function apiObjCreate(data, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': 'ANY'
	}
	if (user) {
		headers["Authorization"] = "Bearer " + user.access_token
	}
	fetch('/create', {
		headers: headers,
		method: "POST",
		body: JSON.stringify(data)
	})
	.then(res => res.json())
	.then(data => {
		console.log(data)
		if (callback) { callback(data) }
	})
	.catch(console.log)
}


export {
	parseApiResponse,
	apiWhoAmI,
	apiNodeAction,
	apiInstanceAction,
	apiNodeSetMonitor,
	apiObjSetMonitor,
	apiObjGetConfig,
	apiObjCreate,
	apiPostAny,
	apiPostNode,
	apiFetchLogs,
}
