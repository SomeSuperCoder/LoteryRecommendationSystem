FROM golang:1.25.2-alpine3.22 AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . ./
RUN go build -o main ./services/recommendations/main.go

# Final stage
FROM alpine:3.22

RUN apk --no-cache add ca-certificates
RUN apk add --no-cache curl

WORKDIR /root
COPY --from=builder /app/main .
EXPOSE 8090

CMD [ "./main" ]
