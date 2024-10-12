FROM amazonlinux:2

# Install necessary tools and libraries
RUN yum update -y && \
    yum groupinstall -y "Development Tools" && \
    yum install -y openssl-devel bzip2-devel libffi-devel wget zlib-devel && \
    yum clean all

# Download and install Python 3.10
RUN cd /opt && \
    wget https://www.python.org/ftp/python/3.10.12/Python-3.10.12.tgz && \
    tar xzf Python-3.10.12.tgz && \
    cd Python-3.10.12 && \
    ./configure --enable-optimizations --with-ensurepip=install --with-openssl=/usr && \
    make && \
    make altinstall && \
    cd .. && \
    rm -rf Python-3.10.12 Python-3.10.12.tgz

# Create symlinks
RUN ln -sf /usr/local/bin/python3.10 /usr/bin/python3 && \
    ln -sf /usr/local/bin/python3.10 /usr/bin/python && \
    ln -sf /usr/local/bin/pip3.10 /usr/bin/pip3 && \
    ln -sf /usr/local/bin/pip3.10 /usr/bin/pip

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Create directory structure for Lambda layer
RUN mkdir -p /opt/python

# Install pdfminer.six
RUN python3 -m pip install pdfminer.six -t /opt/python

# Create zip file
RUN yum install -y zip && \
    cd /opt && zip -r9 /tmp/pdfminer_layer.zip python

# Set working directory
WORKDIR /tmp