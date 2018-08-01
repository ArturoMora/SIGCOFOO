namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FKsEnProjects : DbMigration
    {
        public override void Up()
        {
           /* CreateTable(
                "CR.cat_Empresas",
                c => new
                    {
                        EmpresaId = c.Int(nullable: false, identity: true),
                        NombreEmpresa = c.String(maxLength: 250),
                        NombreTitular = c.String(maxLength: 250),
                        Puesto = c.String(maxLength: 100),
                        Correo = c.String(maxLength: 50),
                        Telefono = c.String(maxLength: 15),
                        Ext = c.String(maxLength: 100),
                        Celular = c.String(maxLength: 15),
                        SitioWeb = c.String(maxLength: 50),
                        AdjuntoId = c.Long(),
                        Descripcion = c.String(maxLength: 250),
                        Edo = c.String(maxLength: 250),
                        Munipio = c.String(maxLength: 250),
                        Colonia = c.String(maxLength: 250),
                        Calle = c.String(maxLength: 250),
                        CP = c.String(maxLength: 5),
                        RFC = c.String(maxLength: 250),
                        RazonSocial = c.String(maxLength: 250),
                        EdoR = c.String(maxLength: 250),
                        MunicipioR = c.String(maxLength: 250),
                        ColoniaR = c.String(maxLength: 250),
                        CalleR = c.String(maxLength: 250),
                        CPR = c.String(maxLength: 5),
                        Nivel = c.Int(nullable: false),
                        FechaRegistro = c.DateTime(nullable: false),
                        Autor = c.String(nullable: false, maxLength: 250),
                        Estado = c.Boolean(nullable: false),
                        PaisId = c.Int(),
                        EstadoId = c.Int(),
                        MunicipioId = c.Int(),
                        PaisIdRS = c.Int(),
                        EstadoIdRS = c.Int(),
                        MunicipioIdRS = c.Int(),
                    })
                .PrimaryKey(t => t.EmpresaId)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("GEN.cat_Estados", t => t.EstadoId)
                .ForeignKey("GEN.cat_Estados", t => t.EstadoIdRS)
                .ForeignKey("GEN.cat_Municipios", t => t.MunicipioId)
                .ForeignKey("GEN.cat_Municipios", t => t.MunicipioIdRS)
                .ForeignKey("GEN.cat_Paises", t => t.PaisId)
                .ForeignKey("GEN.cat_Paises", t => t.PaisIdRS)
                .Index(t => t.AdjuntoId)
                .Index(t => t.PaisId)
                .Index(t => t.EstadoId)
                .Index(t => t.MunicipioId)
                .Index(t => t.PaisIdRS)
                .Index(t => t.EstadoIdRS)
                .Index(t => t.MunicipioIdRS);
            
            CreateTable(
                "CR.UnidadOrganizacionalEmpresas",
                c => new
                    {
                        ClaveUnidad = c.String(nullable: false, maxLength: 20),
                        NombreUnidad = c.String(maxLength: 200),
                        FechaEfectiva = c.DateTime(nullable: false),
                        padre = c.String(),
                        Estado = c.Int(nullable: false),
                        NombreTitular = c.String(maxLength: 50),
                        Puesto = c.String(maxLength: 100),
                        Correo = c.String(maxLength: 50),
                        Telefono = c.String(maxLength: 15),
                        Ext = c.String(maxLength: 100),
                        Celular = c.String(maxLength: 15),
                        Descripcion = c.String(maxLength: 250),
                        Edo = c.String(maxLength: 250),
                        Munipio = c.String(maxLength: 250),
                        Colonia = c.String(maxLength: 250),
                        Calle = c.String(maxLength: 250),
                        CP = c.String(maxLength: 5),
                        PaisId = c.Int(),
                        EstadoId = c.Int(),
                        MunicipioId = c.Int(),
                        EmpresaId = c.Int(nullable: false),
                        AdjuntoId = c.Long(),
                    })
                .PrimaryKey(t => t.ClaveUnidad)
                .ForeignKey("GEN.Adjunto", t => t.AdjuntoId)
                .ForeignKey("CR.cat_Empresas", t => t.EmpresaId, cascadeDelete: true)
                .ForeignKey("GEN.cat_Estados", t => t.EstadoId)
                .ForeignKey("GEN.cat_Municipios", t => t.MunicipioId)
                .ForeignKey("GEN.cat_Paises", t => t.PaisId)
                .Index(t => t.PaisId)
                .Index(t => t.EstadoId)
                .Index(t => t.MunicipioId)
                .Index(t => t.EmpresaId)
                .Index(t => t.AdjuntoId);
            */
            AddColumn("GEN.Proyectos", "EmpresaId", c => c.Int());
            AddColumn("GEN.Proyectos", "ClaveUnidadEmpresa", c => c.String(maxLength: 20));
            CreateIndex("GEN.Proyectos", "EmpresaId");
            CreateIndex("GEN.Proyectos", "ClaveUnidadEmpresa");
            AddForeignKey("GEN.Proyectos", "EmpresaId", "CR.cat_Empresas", "EmpresaId");
            AddForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas", "ClaveUnidad");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.Proyectos", "ClaveUnidadEmpresa", "CR.UnidadOrganizacionalEmpresas");
            /*DropForeignKey("CR.UnidadOrganizacionalEmpresas", "PaisId", "GEN.cat_Paises");
            DropForeignKey("CR.UnidadOrganizacionalEmpresas", "MunicipioId", "GEN.cat_Municipios");
            DropForeignKey("CR.UnidadOrganizacionalEmpresas", "EstadoId", "GEN.cat_Estados");
            DropForeignKey("CR.UnidadOrganizacionalEmpresas", "EmpresaId", "CR.cat_Empresas");
            DropForeignKey("CR.UnidadOrganizacionalEmpresas", "AdjuntoId", "GEN.Adjunto");*/
            DropForeignKey("GEN.Proyectos", "EmpresaId", "CR.cat_Empresas");
            /*DropForeignKey("CR.cat_Empresas", "PaisIdRS", "GEN.cat_Paises");
            DropForeignKey("CR.cat_Empresas", "PaisId", "GEN.cat_Paises");
            DropForeignKey("CR.cat_Empresas", "MunicipioIdRS", "GEN.cat_Municipios");
            DropForeignKey("CR.cat_Empresas", "MunicipioId", "GEN.cat_Municipios");
            DropForeignKey("CR.cat_Empresas", "EstadoIdRS", "GEN.cat_Estados");
            DropForeignKey("CR.cat_Empresas", "EstadoId", "GEN.cat_Estados");
            DropForeignKey("CR.cat_Empresas", "AdjuntoId", "GEN.Adjunto");
            DropIndex("CR.UnidadOrganizacionalEmpresas", new[] { "AdjuntoId" });
            DropIndex("CR.UnidadOrganizacionalEmpresas", new[] { "EmpresaId" });
            DropIndex("CR.UnidadOrganizacionalEmpresas", new[] { "MunicipioId" });
            DropIndex("CR.UnidadOrganizacionalEmpresas", new[] { "EstadoId" });
            DropIndex("CR.UnidadOrganizacionalEmpresas", new[] { "PaisId" });
            DropIndex("CR.cat_Empresas", new[] { "MunicipioIdRS" });
            DropIndex("CR.cat_Empresas", new[] { "EstadoIdRS" });
            DropIndex("CR.cat_Empresas", new[] { "PaisIdRS" });
            DropIndex("CR.cat_Empresas", new[] { "MunicipioId" });
            DropIndex("CR.cat_Empresas", new[] { "EstadoId" });
            DropIndex("CR.cat_Empresas", new[] { "PaisId" });
            DropIndex("CR.cat_Empresas", new[] { "AdjuntoId" });*/
            DropIndex("GEN.Proyectos", new[] { "ClaveUnidadEmpresa" });
            DropIndex("GEN.Proyectos", new[] { "EmpresaId" });
            DropColumn("GEN.Proyectos", "ClaveUnidadEmpresa");
            DropColumn("GEN.Proyectos", "EmpresaId");
            /*DropTable("CR.UnidadOrganizacionalEmpresas");
            DropTable("CR.cat_Empresas");*/
        }
    }
}
