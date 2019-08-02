import React, { useState, useEffect } from "react";
import { apiPostAny } from "../api.js"

function useKeywords(kind) {
	const [data, setData] = useState(null)

	function getKeywords() {
		console.log(kind, "keywords:", data)
		if (data !== null) {
			return
		}
		apiPostAny("/get_keywords", {"kind": kind}, ($) => {
			setData($)
		})
	}
	useEffect(() => {
		getKeywords()
	}, [])

	return data
}

export {
	useKeywords,
}
