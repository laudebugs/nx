---
title: Define the relationship with monorepos
slug: define-the-relationship-with-monorepos
authors: ['Philip Fulcher']
tags: [nx]
cover_image: /blog/images/2024-11-19/header.avif
---

Hi, my name is Philip Fulcher, and I've got 5 minutes to talk to you about monorepos.

So, let's start with what is a monorepo?

## That's like when google only has one repo for the entire company, right?

Not quite. That scale of monorepo doesn't work for most organizations, we can still use a monorepo approach for smaller systems.

## So it's when you throw all your code in one repo and figure out how to manage it lateR?

this is also a pretty bad idea. We need tools and processes to manage this volume of code in a singel repo.

So the best diniftion I've seen comes from monorepo.tools:

## A monorepo is a single repository containg multiple distinct projects with well-defined relationships.

Let's dig into that last part. What do we mean by well-defined relatinoships?

Let's thinkg about relationships between code in terms of distance. We'll start with the samllest possible disnace between two pieces of code: importing something from another file.

Say you have a button component that has all thes Tailwind classes so it stays on brand for your org. you create a form and import that button to use. This is a relationship we take for granted because we do it all the time, but there are some distinct benefits to this.

First, we see the impact of our change immediately. We make a change in the utton, and we either see the reuslt rendered in the browser or we get a failed compilation. Or we have a test suite running that will fail or pass a test. Or lint rule warnings appear in our IDE. We immediately see the result of the change we've made at the imapct on the consumer.

this makes iteration fast: we see the impact of the change and can either refine that change or move on to the next one.

Let's take a step father away and think about the relationship when you jave imported something from a package. Say you have a design system published for your org. You import the button from that package to use in your form. This looks very similar to what we did before, but we've introduced a big change in this relationship. Seeing change is no longer immediate.

If we make a change in the button, there will be some sort of compilation, bundling, and publishing that will need to happen. And we'll need to consume the latest version of the package in our form to see the change.

This is a slow process when you're working alone, but ti can be managed with some tools. However, let's think about what happens if this changes crosses team barriers. Your design system team make s ahcange to the button and has to go through a PR review and merge process. Eventually that change is released as a new version and published. At some point, you upgrade your version of the depdency just to find out the button has changed. But there's a bug. You report is back to the design system team, and now they're going through this entire process to get the fix in and published. this iteration cycle is very slow because understanding the imapct of the change in the design system is no longer immediately apparent to consumers.

Let's step one step further: using APIs. Your frontend (in most cases) requires a backend, and it will be broken without it. There is an implicit depdency between the frontend and backend. You don't import code directly, but you do rely on the backend to function.

Let's say that there a new API endpoint needed, and you agreed with the team that it would be called `api/v1/contact/create` and accept a payload with `contactName`:

But, the backend team had a conversation about naming standards during their sprint and make the decision that it could really be `contact/init` with a payload of `fullName`:

Understanding the impact of this change is now far-removed from the making the change. Because now not only is there the PR merge and packaing and releasing, but also deployment. It may not be until the end of the sprint before the impact of this change is actually understood. And iteration is positively glacial.

So how do monorepos help with these relationships? The shorten the distance of relationships between code. Code is colacated so that the impact of your change can be understood immediately. In our example of the design system, the button will be imported directly instead of going through a build and package process. The design system team can immediately see the imapct of the change they're making and either adjust their approach or fix the issue directly in the consuming app. for the API team, we can define that implicit relationship between backend and frontend so that we trigger e2e tests to confirm a change works. Or we can generate models from the backend to be consumed by the frontend. When the models are changed, the frnotend imported those models will immediately reveal the impact of the change.

So you might think that moving projects into a single repository changes the relationship between the projects. But the relationships we've talked about here already exist, the monorepo makes those relationships explicit and well-defined. With good monorepo tooling, we can understand the impact of change along any of these reationships faster in a monorepo.

If you wan tto know more about monorepos, visit monorepo.tools. If you want to know more about the best monorepo tool that I know of, check the docs and Nx.dev
