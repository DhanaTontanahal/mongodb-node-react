# mongodb-node-react

#Rest ful API with Node JS

What is Rest ?

Representational State Transfer
(Used to transfer data around)

Why RestAPI, why not traditional app ?

USeful  for scenarios where multiple clients are interested to exchange data in a particular format.
Useful for scenarios where you want to communicate to thirdparty data and want the data to be exchanged.

So RestAPI stands as a backend wich supports all the CRUD operations on an exposed Stateless endpoint.

CRUD (Create , Read , Update , Delete )

REST FUL Constraints:

1.)Client Server Architecture --> Clear separation of concerns w.r.t. Front and backend

2.)Stateless(No client context is saved , any client can connect )

3.)Cacheability (Responses defined themselves if they are cacheable or non-cacheable )

4.)Layered System  (Client cconnects to server which doesnt necessairy is actual end point)

5.)Uniform Interface (resources are identifid by requests , totally separated from db schema)

6.)Code on demand(Optional)
