<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="blank-view">
	<h2>Welcome to Degas.</h2>

	<div class="block-buttons">
		<div class="btn" data-click="open-filesystem">
			<i class="icon-folder-open"></i>
			Open&#8230;
		</div>

		<div class="btn disabled_" data-click="from-clipboard">
			<i class="icon-clipboard"></i>
			From clipboard
		</div>
	</div>

	<div class="block-samples" data-click="select-sample">
		<h3>Example</h3>
		<xsl:call-template name="sample-list" />
	</div>

	<xsl:if test="count(./Recents/*) &gt; 0">
		<div class="block-recent" data-click="select-recent-file">
			<h3>Recent</h3>
			<xsl:call-template name="recent-list" />
		</div>
	</xsl:if>

</xsl:template>


<xsl:template name="sample-list">
	<xsl:for-each select="./Samples/*">
		<div class="sample">
			<xsl:attribute name="style">background-image: url(<xsl:value-of select="@preview"/>);</xsl:attribute>
			<xsl:attribute name="data-url"><xsl:value-of select="@path"/></xsl:attribute>
			<span class="name"><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="recent-list">
	<xsl:for-each select="./Recents/*">
		<div class="recent-file">
			<xsl:attribute name="data-file"><xsl:value-of select="@path"/></xsl:attribute>
			<span class="name"><xsl:call-template name="substring-after-last">
				<xsl:with-param name="string" select="@path" />
				<xsl:with-param name="delimiter" select="'/'" />
			</xsl:call-template></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="substring-after-last">
	<xsl:param name="string" />
	<xsl:param name="delimiter" />
	<xsl:choose>
		<xsl:when test="contains($string, $delimiter)">
			<xsl:call-template name="substring-after-last">
				<xsl:with-param name="string" select="substring-after($string, $delimiter)" />
				<xsl:with-param name="delimiter" select="$delimiter" />
			</xsl:call-template>
		</xsl:when>
		<xsl:otherwise><xsl:value-of select="$string" /></xsl:otherwise>
	</xsl:choose>
</xsl:template>


<xsl:template name="tree">
	<xsl:for-each select="./*">
		<div class="row">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:if test="@expanded = 1">
				<xsl:attribute name="class">row expanded</xsl:attribute>
			</xsl:if>
			<div class="item">
				<xsl:choose>
					<xsl:when test="@expanded"><i class="icon-arrow" data-type="toggle-expand"></i></xsl:when>
					<xsl:otherwise><i class="icon-blank"></i></xsl:otherwise>
				</xsl:choose>
				<i><xsl:attribute name="class">icon-<xsl:value-of select="@icon"/></xsl:attribute></i>
				<span><xsl:value-of select="@name"/></span>
				<i data-type="toggle-visibility">
					<xsl:attribute name="class"><xsl:choose>
						<xsl:when test="@visible = 0">icon-eye-off</xsl:when>
						<xsl:otherwise>icon-eye-on</xsl:otherwise>
					</xsl:choose></xsl:attribute>
				</i>
			</div>
			<xsl:if test="@expanded = 1">
				<xsl:call-template name="tree-branch"/>
			</xsl:if>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="tree-branch">
	<div class="children">
		<div>
			<xsl:call-template name="tree"/>
		</div>
	</div>
</xsl:template>


</xsl:stylesheet>