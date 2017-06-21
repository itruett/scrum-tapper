var verbs = ["Actualize", "Cloudify", "Create", "Customize", "Enable", "Enhance", "Handle", "Support"];
var adjectives = ["accurate", "backward-compatible", "consistent", "serendipitus", "synchronous", "synergistic", ];
var nouns = ["channel", "channels", "interface", "interfaces", "engagement", "engagements", "eventualities", "result", "results", "service", "services", "usability"];
var sizes = [1, 2, 3, 5, 8, 13, 21];

class Story {
	constructor(complexity, effort = 0, points = 0, project = null) {
		this.remainingComplexity = this.complexity = complexity;
		this.remainingEffort = this.effort = effort;
		this.points = points;
		this.name = this.randomStoryName();
		this.project = project;

		if (project) {
			this.storyNumber = project.storyNumber++;
		}
	}
	
	groom() {
		var availableSizes;

		if (this.points > 1) {
			for (var i = 0; !availableSizes && i < sizes.length; i++) {
				if (sizes[i] >= this.points) {
					availableSizes = sizes.slice(0, i);
				}
			}
		} else {
			return;
		}

		var newStorySize = this.choose(availableSizes);

		var newStoryComplexity = this.complexity * (newStorySize / this.points);
		var newStoryEffort = this.effort * (newStorySize / this.points);
		var newStory = new Story(newStoryComplexity, newStoryEffort, newStorySize, this.project);
		this.project.addStory(newStory);

		this.remainingComplexity -= newStoryComplexity;
		this.complexity -= newStoryComplexity;
		this.remainingEffort -= newStoryEffort;
		this.effort -= newStoryEffort;
		this.points -= newStorySize;

		if (sizes.includes(this.points)) {
			this.updateStoryCard();
		} else {
			this.groom();
		}
	}
	
	random(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; 
	}
	
	choose(array) {
		return array[this.random(0, array.length - 1)]
	}
	
	randomStoryName() {
		return this.choose(verbs) + " " + this.choose(adjectives) + " " + this.choose(nouns);
	}
	
	updateStoryCard() {
		var oldStoryCard = document.getElementById("story" + this.storyNumber);
		var newCard = new Card(this);
		oldStoryCard.parentNode.replaceChild(newCard.getElement(), oldStoryCard);
	}
}

class Project extends Story {
	constructor(complexity = 1000, effort = 1000) {
		super(complexity, effort);
		this.stories = [];
		this.strength = 1;
		this.storyNumber = 1;
		this.clearBacklog();
	}
	
	groom() {
		var newStories = this.random(1, 10);

		for (var i = 0; i < newStories; i++) {
			var size = this.choose(sizes);
			var complexity = this.anchorStory.complexity * size;
			var effort = this.anchorStory.effort * size;

			var story = new Story(complexity, effort, size, this);
			this.addStory(story);
		}
	}
	
	addStory(story) {
		this.stories.push(story);
		this.remainingEffort -= story.remainingEffort;
		this.remainingComplexity -= story.remainingComplexity;
		var card = new Card(story);
		document.getElementById("backlog").appendChild(card.getElement());
	}
	
	helloWorld() {
		var complexity = this.random(1, 5);
		var effort = this.random(1, 5);
		this.anchorStory = new Story(complexity, effort, 1, this);
		this.addStory(this.anchorStory);
	}
	
	clearBacklog() {
		var backlog = document.getElementById("backlog");

		while(backlog.firstChild && backlog.removeChild(backlog.firstChild));
	}
}

class Card {
	constructor(story) {
		this.story = story;
	}

	label(text, className = null) {
		var label = document.createElement("label");
		label.innerText = text;
		
		if (className) {
			label.className = className;
		}

		return label;
	}
	
	groomButton() {
		var button = document.createElement("button");
		button.innerText = "Groom";
		var story = this.story;
		button.addEventListener("click", function() {
			story.groom();
		});
		
		return button;
	}
	
	getElement() {
		var element = document.createElement("div");
		element.className = "storyCard";
		element.id = "story" + this.story.storyNumber;
		element.appendChild(this.label(this.story.points, "storyPoints"));
		element.appendChild(this.label(this.story.name, "storyName"));

		if (this.story.points > 2) {
			element.appendChild(this.groomButton());
		}
		
		return element;
	}
}