namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class insumoTipo : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "MT.TipoInsumo",
                c => new
                    {
                        TipoInsumoId = c.Int(nullable: false, identity: true),
                        DescripcionInsumo = c.String(),
                        EstadoDisponible = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.TipoInsumoId);
            
            AlterColumn("MT.ITFInsumos", "TipoIns", c => c.Int(nullable: false));
            CreateIndex("MT.ITFInsumos", "TipoIns");
            AddForeignKey("MT.ITFInsumos", "TipoIns", "MT.TipoInsumo", "TipoInsumoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("MT.ITFInsumos", "TipoIns", "MT.TipoInsumo");
            DropIndex("MT.ITFInsumos", new[] { "TipoIns" });
            AlterColumn("MT.ITFInsumos", "TipoIns", c => c.String(nullable: false, maxLength: 50));
            DropTable("MT.TipoInsumo");
        }
    }
}
