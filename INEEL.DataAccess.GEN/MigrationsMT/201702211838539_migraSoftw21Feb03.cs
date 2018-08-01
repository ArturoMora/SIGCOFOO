namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraSoftw21Feb03 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto");
            DropForeignKey("MT.SoftwarePersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos");
            DropForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso");
            DropForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware");
            DropForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal");
            DropIndex("MT.AutorSoftware", new[] { "SoftwarePersonalId" });
            DropIndex("MT.SoftwarePersonal", new[] { "ProyectoId" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoSoftwareId" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualTecnico" });
            DropIndex("MT.SoftwarePersonal", new[] { "ManualUsuario" });
            DropIndex("MT.SoftwarePersonal", new[] { "CodigoFuente" });
            DropIndex("MT.SoftwarePersonal", new[] { "TipoAcceso" });
            DropIndex("MT.SoftwarePersonal", new[] { "EstadoFlujoId" });
            DropTable("MT.SoftwarePersonal");
        }
        
        public override void Down()
        {
            CreateTable(
                "MT.SoftwarePersonal",
                c => new
                    {
                        SoftwarePersonalId = c.Int(nullable: false, identity: true),
                        ProyectoId = c.String(maxLength: 10),
                        Nombre = c.String(nullable: false, unicode: false),
                        NumeroVersion = c.Single(),
                        AnioVersion = c.Int(),
                        DescripcionFuncional = c.String(unicode: false),
                        PlataformaDesarrollo = c.String(unicode: false),
                        TipoSoftwareId = c.Int(),
                        DerechoAutor = c.String(unicode: false),
                        Comentarios = c.String(unicode: false),
                        ManualTecnico = c.Long(),
                        ManualUsuario = c.Long(),
                        CodigoFuente = c.Long(),
                        TipoAcceso = c.Int(nullable: false),
                        Estado = c.Boolean(nullable: false),
                        GerenciaClave = c.String(),
                        ClavePersona = c.String(),
                        FechaValidacion = c.DateTime(),
                        EstadoFlujoId = c.Int(),
                    })
                .PrimaryKey(t => t.SoftwarePersonalId);
            
            CreateIndex("MT.SoftwarePersonal", "EstadoFlujoId");
            CreateIndex("MT.SoftwarePersonal", "TipoAcceso");
            CreateIndex("MT.SoftwarePersonal", "CodigoFuente");
            CreateIndex("MT.SoftwarePersonal", "ManualUsuario");
            CreateIndex("MT.SoftwarePersonal", "ManualTecnico");
            CreateIndex("MT.SoftwarePersonal", "TipoSoftwareId");
            CreateIndex("MT.SoftwarePersonal", "ProyectoId");
            CreateIndex("MT.AutorSoftware", "SoftwarePersonalId");
            AddForeignKey("MT.AutorSoftware", "SoftwarePersonalId", "MT.SoftwarePersonal", "SoftwarePersonalId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "TipoSoftwareId", "MT.cat_TipoSoftware", "TipoSoftwareId");
            AddForeignKey("MT.SoftwarePersonal", "TipoAcceso", "MT.cat_TipoAcceso", "TipoAccesoId", cascadeDelete: true);
            AddForeignKey("MT.SoftwarePersonal", "ProyectoId", "GEN.Proyectos", "ProyectoId");
            AddForeignKey("MT.SoftwarePersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
            AddForeignKey("MT.SoftwarePersonal", "ManualUsuario", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("MT.SoftwarePersonal", "ManualTecnico", "GEN.Adjunto", "AdjuntoId");
            AddForeignKey("MT.SoftwarePersonal", "CodigoFuente", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
