# AU Postcodes

Simple express app that allows you to search all
postcodes in Australia.

---

# End points

```
/postcodes?page=:page&limit=:limit
```

Returns paginated results for all of the postcodes.
Limit is a integer between 20 & 50.

```
/postcodes/:postcode
```

Will attempt to return the data for the specified postcode.
If none is found, it will return a 404.

```
/hash
```

Returns the current md5 hash of the entire postcode object.
Useful for versioning.
