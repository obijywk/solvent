FROM node:slim AS builder
LABEL stage=builder

RUN apt-get update
RUN apt-get install -y build-essential git libfst-dev python

RUN mkdir -p /opt/nutrimatic
WORKDIR /opt/nutrimatic
RUN wget https://github.com/egnor/nutrimatic/tarball/master
RUN tar xzf master --strip 1
RUN rm master

RUN mkdir -p /opt/julia
WORKDIR /opt/julia
RUN wget https://julialang-s3.julialang.org/bin/linux/x64/0.5/julia-0.5.2-linux-x86_64.tar.gz
RUN tar xzf julia-0.5.2-linux-x86_64.tar.gz --strip 1
RUN rm julia-0.5.2-linux-x86_64.tar.gz
RUN ln -s /opt/julia/lib/julia /usr/local/lib/julia

RUN mkdir -p /root/.julia/v0.5/Collective
WORKDIR /root/.julia/v0.5/Collective
RUN git clone https://github.com/obijywk/Collective.jl.git .

RUN mkdir -p /root/.julia/v0.5/Compat
WORKDIR /root/.julia/v0.5/Compat
RUN git clone --branch v0.9.0 https://github.com/JuliaLang/Compat.jl.git .

RUN mkdir -p /root/.julia/v0.5/DataStructures
WORKDIR /root/.julia/v0.5/DataStructures
RUN git clone --branch v0.4.6 https://github.com/JuliaCollections/DataStructures.jl.git .

RUN mkdir -p /root/.julia/v0.5/Iterators
WORKDIR /root/.julia/v0.5/Iterators
RUN git clone --branch v0.2.0 https://github.com/JuliaCollections/Iterators.jl.git .

RUN /opt/julia/bin/julia -e 'using Collective'

RUN mkdir -p /opt/solvent

COPY data /opt/solvent/data
COPY public /opt/solvent/public

COPY binding.gyp /opt/solvent/
COPY credentials.json /opt/solvent/
COPY package.json /opt/solvent/
COPY tsconfig.json /opt/solvent/
COPY tslint.json /opt/solvent/
COPY webpack.config.js /opt/solvent/

COPY src /opt/solvent/src

WORKDIR /opt/solvent
RUN npm install
RUN npm run build-native
RUN npm run build-server
RUN npm run build-client

EXPOSE 8080
CMD ["npm", "run", "run-server"]


FROM node:slim

RUN apt-get update
RUN apt-get install -y libfst4

COPY --from=builder /usr/local/lib/julia/ /usr/local/lib/julia/

RUN mkdir -p /opt/julia/lib
COPY --from=builder /opt/julia/lib/ /opt/julia/lib/

RUN mkdir -p /root/.julia
COPY --from=builder /root/.julia/ /root/.julia/

RUN mkdir -p /opt/solvent /opt/solvent/build/Release
COPY --from=builder /opt/solvent/credentials.json /opt/solvent/credentials.json
COPY --from=builder /opt/solvent/package.json /opt/solvent/package.json
COPY --from=builder /opt/solvent/build/Release/*.node /opt/solvent/build/Release/
COPY --from=builder /opt/solvent/built/ /opt/solvent/built/
COPY --from=builder /opt/solvent/data/ /opt/solvent/data/
COPY --from=builder /opt/solvent/dist/ /opt/solvent/dist/
COPY --from=builder /opt/solvent/public/ /opt/solvent/public/

WORKDIR /opt/solvent
RUN npm install --only=prod

EXPOSE 8080
CMD ["npm", "run", "run-server"]
