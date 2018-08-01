namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Agregarpaisesconvocatoria : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CR.tab_PaisesPorConvocatoria",
                c => new
                    {
                        PaisesPorConvocatoriaID = c.Int(nullable: false, identity: true),
                        ConvocatoriaId = c.Int(nullable: false),
                        PaisID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.PaisesPorConvocatoriaID)
                .ForeignKey("CR.tab_Convocatoria", t => t.ConvocatoriaId, cascadeDelete: true)
                .ForeignKey("CH.cat_Pais", t => t.PaisID, cascadeDelete: true)
                .Index(t => t.ConvocatoriaId)
                .Index(t => t.PaisID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_PaisesPorConvocatoria", "PaisID", "CH.cat_Pais");
            DropForeignKey("CR.tab_PaisesPorConvocatoria", "ConvocatoriaId", "CR.tab_Convocatoria");
            DropIndex("CR.tab_PaisesPorConvocatoria", new[] { "PaisID" });
            DropIndex("CR.tab_PaisesPorConvocatoria", new[] { "ConvocatoriaId" });
            DropTable("CR.tab_PaisesPorConvocatoria");
        }
    }
}
