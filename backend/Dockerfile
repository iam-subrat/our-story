FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY go.* ./
RUN go mod download

# install build dependencies required for CGO
RUN apk add --no-cache gcc musl-dev

COPY . .
# when CGO is enabled we need a C compiler; alpine image has it now
RUN CGO_ENABLED=1 GOOS=linux go build -o ourstory

FROM alpine:latest
RUN apk --no-cache add ca-certificates sqlite-libs
WORKDIR /root/
COPY --from=builder /app/ourstory .
EXPOSE 8080
CMD ["./ourstory"]
