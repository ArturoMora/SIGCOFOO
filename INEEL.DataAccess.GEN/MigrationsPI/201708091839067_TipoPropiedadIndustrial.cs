namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class TipoPropiedadIndustrial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "PI.cat_TipoPropiedadIndustrial",
                c => new
                    {
                        TipoPropiedadIndustrialId = c.Int(nullable: false, identity: true),
                        Descripcion = c.String(),
                        DescripcionCorta = c.String(),
                        Estado = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoPropiedadIndustrialId);
            
            AddColumn("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrialId", c => c.Int(nullable: true));
            CreateIndex("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrialId");
            AddForeignKey("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrialId", "PI.cat_TipoPropiedadIndustrial", "TipoPropiedadIndustrialId", cascadeDelete: false);
            DropColumn("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrial");
        }
        
        public override void Down()
        {
            AddColumn("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrial", c => c.Int(nullable: false));
            DropForeignKey("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrialId", "PI.cat_TipoPropiedadIndustrial");
            DropIndex("PI.tab_PropiedadIndustrial", new[] { "TipoPropiedadIndustrialId" });
            DropColumn("PI.tab_PropiedadIndustrial", "TipoPropiedadIndustrialId");
            DropTable("PI.cat_TipoPropiedadIndustrial");
        }
    }
}
