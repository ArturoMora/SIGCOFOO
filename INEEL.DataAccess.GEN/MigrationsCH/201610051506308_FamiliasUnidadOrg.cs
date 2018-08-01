namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FamiliasUnidadOrg : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_FamiliaUnidad",
                c => new
                    {
                        ClaveUnidad = c.String(maxLength: 10),
                        FechaEfectiva = c.DateTime(nullable: false),
                        FamiliaUnidadId = c.Int(nullable: false, identity: true),
                        FamiliaPuestosId = c.Int(),
                        Estado = c.Int(nullable: false),
                        familia_FamiliaId = c.Int(),
                    })
                .PrimaryKey(t => t.FamiliaUnidadId)
                .ForeignKey("CH.tab_FamiliaPuestos", t => t.familia_FamiliaId)
                .ForeignKey("GEN.cat_UnidadOrganizacional", t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => new { t.ClaveUnidad, t.FechaEfectiva })
                .Index(t => t.familia_FamiliaId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_FamiliaUnidad", new[] { "ClaveUnidad", "FechaEfectiva" }, "GEN.cat_UnidadOrganizacional");
            DropForeignKey("CH.tab_FamiliaUnidad", "familia_FamiliaId", "CH.tab_FamiliaPuestos");
            DropIndex("CH.tab_FamiliaUnidad", new[] { "familia_FamiliaId" });
            DropIndex("CH.tab_FamiliaUnidad", new[] { "ClaveUnidad", "FechaEfectiva" });
            DropTable("CH.tab_FamiliaUnidad");
        }
    }
}
