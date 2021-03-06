// ==UserScript==
// @name               Librus Srednia
// @namespace          http://kgrzeg.pl/
// @homepage           http://kgrzeg.pl/
// @homepageURL        http://kgrzeg.pl/
// @description        Automatyczne liczenie średniej ocen na portalu synergia.librus.pl z uwzględnieniem wag dla uczniów szkół, które wyłączyły tę funkcjonalność
// @author             Grzegorz Kupczyk

// @version            0.2
// @downloadURL        https://raw.githubusercontent.com/GrzegorzKu/avgsynergia/master/dist/tamper.user.js
// @updateURL          https://raw.githubusercontent.com/GrzegorzKu/avgsynergia/master/dist/tamper.user.js
// @supportURL         https://github.com/GrzegorzKu/avgsynergia/issues

// @require            https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @icon64             https://raw.githubusercontent.com/GrzegorzKu/avgsynergia/master/images/logo.png
// @icon64URL          https://raw.githubusercontent.com/GrzegorzKu/avgsynergia/master/images/logo.png

// @resource floating  https://raw.githubusercontent.com/GrzegorzKu/avgsynergia/master/dist/floating.html
// @resource css       https://raw.githubusercontent.com/GrzegorzKu/avgsynergia/master/dist/style.css

// @match              https://synergia.librus.pl/przegladaj_oceny/uczen

// @grant              GM_getResourceText
// @grant              GM_addStyle
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
  /* jshint ignore:end */
  /* jshint esnext: false */
  /* jshint esversion: 6 */
  /* jshint asi: true */

  class WeightedAverage {
	constructor() {
		this._rawValues = 0
		this._weights = 0
	}
	add(v, w) {
		this._rawValues += v * w
		this._weights += w
	}
	appendAverage(wavg) {
		this._rawValues += wavg.rawValue
		this._weights += wavg.weights
	}
	reset() {
		this._rawValues = 0
		this._weights = 0
	}

	get value() {
		if (this._weights !== 0)
			return this._rawValues / this._weights
		return 0 //in JS "x / 0 == Infinity" for x ∈ R, so prevent this
	}
	get rawValue() {
		return this._rawValues
	}
	get weights() {
		return this._weights
	}
}
  class Mark {
	constructor(boxElement, grade, weight) {
		if (boxElement) {
			this._$boxElement = $(boxElement)
			this._$aElement = this._$boxElement.children().first()

			var value = this._$aElement.text()
			this._value = this.parseValue(value)
			if (typeof this._value === "number") {
				this._countable = true
				this._countToAverage = this.parseCountToAverage(this._$aElement.attr("title"))
				this._weight = this.parseWeight(this._$aElement.attr("title"))

				if (this._weight === null)
					this._weight = Mark.defualt_weight
			} else {
				this._countable = false
				this._countToAverage = false
				this._weight = 0
			}
		} else {
			this._value = grade
			this._weight = Math.min(1, weight)	//weight can't be smaller than 1
			this._countToAverage = true
			this._countable = true
			this._$boxElement = this._generateBox()
			this._$aElement = this._$boxElement.children().first()
		}

	}
	parseValue(v) {
		var re = /^\d(\-|\+)?$/
		var val = 0
		if (re.test(v)) {
			val = parseInt(v)
			if (v[v.length - 1] === '-')
				return val - 0.25
			if (v[v.length - 1] === '+')
				return val + 0.5
			return val

		} else {
			val = v
		}
		return val
	}
	reverseParseValue(v) {
		if (v == v.toFixed())
			return v
		let frac = v - v.toFixed()
		if (frac == -0.25)
			return v.toFixed() + "-"
		if (frac == -0.5)
			return parseInt(v) + "+"
		return v
	}
	parseWeight(text) {
		let index = text.indexOf("Waga: ")

		if (index === -1)
			return null

		//get 2 characters, for 1-digit weight it can be "1<",
		//but parseInt will ommit unnecessary sign
		//for 2-digits work well
		return parseInt(text.substring(index + 6, index + 8))
	}
	parseCountToAverage(text) {
		if (text.indexOf("Licz do średniej: tak") !== -1)
			return true
		if (text.indexOf("Licz do średniej: nie") !== -1)
			return false
		return null
	}

	_generateBox() {
		let bgcolor = "black"
		let color = "white"
		let box = $("<span>")
			.addClass("grade-box")
			.css("background-color", bgcolor)
			.css("border-color", color)

		$("<a>")
			.attr("href", "javascript:void(0)")
			.addClass("ocena")
			.css("color", color)
			.text(this.reverseParseValue(this._value))
			.attr("title", this._generateTitle())
			.tooltip()
			.appendTo(box)

		return box
	}
	_generateTitle() {
		let d = new Date()
		let teacher = this._teacher

		return "Kategoria: ocena niestandardowa<br>" +
			"Data: " + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + "<br>" +
			"Nauczyciel: " + teacher + "<br>" +
			"Licz do średniej: tak<br>" +
			"Waga: " + this._weight + "<br>" +
			"Dodał: " + teacher
	}

	get value() {
		return this._value
	}
	get weight() {
		return this._weight
	}
	get countable() {
		return this._countable
	}
	get countToAverage() {
		return this._countToAverage
	}
	get multipliedValue() {
		return this._value * this._weight
	}
	get $boxElement() {
		return this._$boxElement
	}
	get _teacher() {
		if (Mark.prototype.teacher) {
			return Mark.prototype.teacher
		} else {
			let t = $("#user-section b").text()

			let match = t.indexOf("(uczeń")
			if (match !== -1) {
				t = t.substring(0, match)
				Mark.prototype.teacher = t.trim()
				return Mark.prototype.teacher
			}

			match = t.indexOf("(rodzic")
			if (match !== -1) {
				t = t.substring(0, match)
				Mark.prototype.teacher = t.trim()
				return Mark.prototype.teacher
			}

			Mark.prototype.teacher = t.trim()
			return Mark.prototype.teacher
		}
	}
}
Mark.defualt_weight = 1
  class Subject {
	constructor(row) {
		let cells = $(row).children()

		this._name = $.trim($(cells[1]).text()) || "brak nazwy"

		this._marks_I = []
		this._marks_II = []

		this._marks_extra_I = []
		this._marks_extra_II = []

		this._marks_cell_I = cells[Subject.MarksICell]
		this._marks_cell_II = cells[Subject.MarksIICell]

		this._average_cell_I = cells[Subject.AvgICell]
		this._average_cell_II = cells[Subject.AvgIICell]
		this._average_cell_III = cells[Subject.AvgIIICell]

		this._ignore_count_to_average_flag = false

		this._readMarks()
		this.updateAverages()
	}

	updateAverages() {
		let avg_I = new WeightedAverage(),
			avg_II = new WeightedAverage()

		let marks_I = $.merge($.merge([], this._marks_I), this._marks_extra_I)
		let marks_II = $.merge($.merge([], this._marks_II), this._marks_extra_II)

		$.each(marks_I, (i, m) => {
			if (m.countable && (m.countToAverage || this._ignore_count_to_average_flag)) avg_I.add(m.value, m.weight)
		})
		$.each(marks_II, (i, m) => {
			if (m.countable && (m.countToAverage || this._ignore_count_to_average_flag)) avg_II.add(m.value, m.weight)
		})


		if (avg_I.value !== 0)
			$(this._average_cell_I).text(avg_I.value.toFixed(2))
		else
			$(this._average_cell_I).text("")
		if (avg_II.value !== 0) {
			$(this._average_cell_II).text(avg_II.value.toFixed(2))

			avg_I.appendAverage(avg_II)
			$(this._average_cell_III).text(avg_I.value.toFixed(2))
		} else {
			$(this._average_cell_II).text("")
			$(this._average_cell_III).text("")
		}
	}
	addMark(mark, semester) {
		if (semester == 0) {
			this._marks_extra_I.push(mark)

			if ($(this._marks_cell_I).text() == "Brak ocen")
				$(this._marks_cell_I).html("")

			mark.$boxElement.appendTo(this._marks_cell_I)
		} else {
			this._marks_extra_II.push(mark)

			if ($(this._marks_cell_II).text() == "Brak ocen")
				$(this._marks_cell_II).html("")

			mark.$boxElement.appendTo(this._marks_cell_II)
		}
		this.updateAverages()
	}
	resetMarks() {
		$.merge(this._marks_extra_I, this._marks_extra_II)
			.forEach((m) => {
				m.$boxElement.remove()
			})

		this._marks_extra_I = []
		this._marks_extra_II = []
		this.updateAverages()
	}

	_readMarks() {
		let self = this
		$(".grade-box", this._marks_cell_I).each((i, m) => {
			self._marks_I.push(new Mark(m))
		})
		$(".grade-box", this._marks_cell_II).each((i, m) => {
			self._marks_II.push(new Mark(m))
		})
	}

	get name() {
		return this._name
	}
	get marks_I() {
		return this._marks_I
	}
	get marks_II() {
		return this._marks_II
	}

	set ignore_count_to_average_flag(v) {
		let t = this._ignore_count_to_average_flag
		this._ignore_count_to_average_flag = v

		if (t !== v)
			this.updateAverages()
	}

	/* read table's header, and calculate the offsets of cells
		argument thead:jquery object (last row of thead)	*/
	static calculate_cells(thead) {
		if (Subject.TheadProcessed)
			return

		thead.children().each((i, e) => {
			i += 2 //the header have 2 rows with spaned cells; second is offset by 2
			switch ($(e).text()) {
				case "Oceny bieżące":
					{
						if (i <= Subject.MarksICell)
							break
						else
							Subject.MarksIICell = i
						break
					}

				case "Śr.I":
					{
						Subject.AvgICell = i
						break
					}

				case "Śr.II":
					{
						Subject.AvgIICell = i
						break
					}

				case "Śr.R":
					{
						Subject.AvgIIICell = i
						break
					}
			}
		})

		Subject.TheadProcessed = true
	}
}
Subject.MarksICell = 2
Subject.MarksIICell = 5
Subject.AvgICell = 3
Subject.AvgIICell = 6
Subject.AvgIIICell = 8
Subject.TheadProcessed = false
  class Controller {
	constructor() {
		this._subjects = []

		this._readSubjects()
		this._fillForm()
		this._attachButtons()
		this._attachDisplay()

		//hide controller ui
		$("#AverageFloating thead").click()
	}

	addMark() {
		let sub = parseInt($("#avSubject").val())
		let semester = parseInt($("#avSemester").val())
		let grade = parseFloat($("#avRating").val())
		let weight = parseInt($("#avWeight").val())

		let mark = new Mark(false, grade, weight)
		this._subjects[sub].addMark(mark, semester)
	}
	clearMarks() {
		this._subjects.forEach((s) => {
			s.resetMarks()
		})
	}
	normalize() {
		$('.decorated.stretch:visible>tbody')
			.toggleClass("markNormalize")
	}
	ignoreCountToAverage() {
		let val = $("#avIgnoreCountToAverage").prop("checked")
		this._subjects.forEach((e, i) => {
			e.ignore_count_to_average_flag = val;
		})
	}

	_readSubjects() {
		let thead = $('.decorated.stretch:visible>thead>tr:last')
		Subject.calculate_cells(thead)

		var mark_rows = $('.decorated.stretch:visible>tbody')
			.children()
			.filter(function (i, e) {
				return $(e).attr('id') === undefined
			})

		let self = this

		mark_rows.each(function (i, r) {
			if (mark_rows.length - 1 == i)
				return //ommit last row ("behavior")

			self._subjects.push(new Subject(r))
		})
	}
	_fillForm() {
		var subs = $("#avSubject")
		this._subjects.forEach((e, i) => {
			$("<option>")
				.attr("value", i)
				.text(e.name)
				.appendTo(subs)
		})
	}
	_attachButtons() {
		$("#avSubmit").click(this.addMark.bind(this))
		$("#avReset").click(this.clearMarks.bind(this))
		$("#avNormalize").click(this.normalize.bind(this))
		$("#avIgnoreCountToAverage").click(this.ignoreCountToAverage.bind(this))
	}
	_attachDisplay() {
		this._pane_hidded = false
		$("#avHide").click((e) => {
			if (this._pane_hidded) {
				//show
				$("#AverageFloating")
					.animate({
						bottom: 0
					})
				this._pane_hidded = !this._pane_hidded
			} else {
				//hide
				let height =
					$("#AverageFloating").height() -
					(
						$("#avHide").height() +
						parseInt($("#avHide").css("padding-top")) +
						parseInt($("#avHide").css("padding-bottom")) +
						parseInt($("#AverageFloating table").css("margin-top"))
					)

				$("#AverageFloating")
					.animate({
						bottom: -height
					})
				this._pane_hidded = !this._pane_hidded
			}
		})
	}
}

  $(function(){
    var css = GM_getResourceText("css")
    var floating = GM_getResourceText("floating")

    GM_addStyle( css )
    $(document.body).append( $.parseHTML( floating ))

    var ctrl = new Controller()

    console.log("Automatyczne liczenie średniej możliwe dzięki %cGrzesiowi Kupczyk %c;)", "color:yellowgreen", "color:inherit");
  })

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */