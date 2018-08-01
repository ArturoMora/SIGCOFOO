namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PaisesEstadosMunicipios : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.cat_UnidadOrganizacional", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            //DropIndex("GEN.cat_UnidadOrganizacional", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" });
            //DropColumn("GEN.cat_UnidadOrganizacional", "padre");
            //RenameColumn(table: "GEN.cat_UnidadOrganizacional", name: "UnidadOrganizacional_ClaveUnidad", newName: "padre");
            //DropPrimaryKey("GEN.cat_UnidadOrganizacional");
            CreateTable(
                "GEN.cat_Estados",
                c => new
                    {
                        EstadoId = c.Int(nullable: false, identity: true),
                        NombreEstado = c.String(maxLength: 200),
                        PaisId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.EstadoId)
                .ForeignKey("GEN.cat_Paises", t => t.PaisId, cascadeDelete: true)
                .Index(t => t.PaisId);
            
            CreateTable(
                "GEN.cat_Paises",
                c => new
                    {
                        PaisId = c.Int(nullable: false, identity: true),
                        NombrePais = c.String(maxLength: 200),
                    })
                .PrimaryKey(t => t.PaisId);
            
            CreateTable(
                "GEN.cat_Municipios",
                c => new
                    {
                        MunicipioId = c.Int(nullable: false, identity: true),
                        NombreMunicipio = c.String(maxLength: 200),
                        EstadoId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.MunicipioId)
                .ForeignKey("GEN.cat_Estados", t => t.EstadoId, cascadeDelete: true)
                .Index(t => t.EstadoId);
            
            //AlterColumn("GEN.cat_Personas", "ClaveUnidad", c => c.String(maxLength: 10));
            //AlterColumn("GEN.cat_UnidadOrganizacional", "padre", c => c.String(maxLength: 10));
            //AddPrimaryKey("GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            //CreateIndex("GEN.cat_Personas", "ClaveUnidad");
            //CreateIndex("GEN.cat_UnidadOrganizacional", "padre");
            //AddForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            //AddForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            //DropColumn("GEN.cat_UnidadOrganizacional", "UnidadOrganizacional_FechaEfectiva");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_UnidadOrganizacional", "UnidadOrganizacional_FechaEfectiva", c => c.DateTime());
            DropForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.cat_Municipios", "EstadoId", "GEN.cat_Estados");
            DropForeignKey("GEN.cat_Estados", "PaisId", "GEN.cat_Paises");
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "padre" });
            DropIndex("GEN.cat_Personas", new[] { "ClaveUnidad" });
            DropIndex("GEN.cat_Municipios", new[] { "EstadoId" });
            DropIndex("GEN.cat_Estados", new[] { "PaisId" });
            DropPrimaryKey("GEN.cat_UnidadOrganizacional");
            AlterColumn("GEN.cat_UnidadOrganizacional", "padre", c => c.String());
            AlterColumn("GEN.cat_Personas", "ClaveUnidad", c => c.String());
            DropTable("GEN.cat_Municipios");
            DropTable("GEN.cat_Paises");
            DropTable("GEN.cat_Estados");
            AddPrimaryKey("GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
            RenameColumn(table: "GEN.cat_UnidadOrganizacional", name: "padre", newName: "UnidadOrganizacional_ClaveUnidad");
            AddColumn("GEN.cat_UnidadOrganizacional", "padre", c => c.String());
            CreateIndex("GEN.cat_UnidadOrganizacional", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" });
            AddForeignKey("GEN.cat_UnidadOrganizacional", new[] { "UnidadOrganizacional_ClaveUnidad", "UnidadOrganizacional_FechaEfectiva" }, "GEN.cat_UnidadOrganizacional", new[] { "ClaveUnidad", "FechaEfectiva" });
        }
    }
}
